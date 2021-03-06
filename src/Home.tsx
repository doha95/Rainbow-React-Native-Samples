import * as React from 'react';
import { StyleSheet } from 'react-native';
import { startUpService, permissionsService, EventsTabIcon, SearchBarInput, IBackButtonHandler, Logger } from 'react-native-rainbow-module';
import { Button, Container, Content, Footer, FooterTab, Header, Icon, Text } from 'native-base';
import { ContactsComponent } from './ContactsComponent';
import { InvitationsComponent } from './InvitationsComponent';
import { CallLogComponent } from './CallLogComponent';
import appStyleConfig from '../app-styles.json';
import { Actions } from 'react-native-router-flux';
import { BubblesComponent } from './BubblesComponent'
import { ConversationsComponent } from './ConversationsComponent';
import { SearchComponent } from './SearchComponent'

const logger = new Logger('Home');
const homeStyle = StyleSheet.create(appStyleConfig.home);
export default function Home() {
	const [selectedTab, setSelectedTab] = React.useState<string>('contacts');
	const [isSearchMode, setIsSearchMode] = React.useState<boolean>(false);
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	React.useEffect(() => {
		// request al the permission the App is needed
		const allAppPermissions = permissionsService.appPermissions;
		permissionsService.checkMultiPermissionRequest(allAppPermissions).then((result) => {
			// Do what ever you want

		});
		startUpService.getLocalContacts();
		startUpService.getRosterContacts();
	}, [])
	const openMenu = () => {
		Actions.AppMenu();
	}
	const renderTab = () => {
		switch (selectedTab) {
			case 'contacts':
				return <ContactsComponent />
			case 'invitations':
				return <InvitationsComponent />
			case 'callLogs':
				return <CallLogComponent />
			case 'bubbles':
				return <BubblesComponent />
			case 'conversations':
				return <ConversationsComponent />
			default:
				return (
					<Content>
						<Text>No Data Found</Text>
					</Content>
				)
		}

	}
	const switchTab = (tabName: string) => () => {
		setSelectedTab(tabName);

	}

	const updateHomeSearchState = (value: boolean, searchQuery: string) => {
		setIsSearchMode(value);
		setSearchQuery(searchQuery);

	};

	const cancelSearch = () => {
		if (isSearchMode && Actions.currentScene === 'contactInformation') {
			console.info('onBackButtonPressed handled by home, exit contact Card details and back to the search');
			Actions.pop();
			return true;
		}
		if (isSearchMode) {
			logger.info('onBackButtonPressed handled by home, exit searchMode');
			setIsSearchMode(false);

			if (searchQuery) {
				// To do clear input value on back button pressed.
			} else {
				setIsSearchMode(false);
			}
			return true;
		}
		return false;
	};

	const handlers: IBackButtonHandler[] = [];

	const registerBackButtonHandler = (handler: IBackButtonHandler) => {
		handlers.push(handler);
		return () => {
			const index = handlers.indexOf(handler);
			if (index >= 0) {
				handlers.splice(index);
			} else {
				logger.error('Failed to unregister handler; handler not found');
			}
		};
	};


	const searchComponent = <SearchComponent />;


	return (
		<React.Fragment>
			<Container>
				<Header style={[homeStyle.tabBackground, styles.header]}>
					{!isSearchMode && (<Icon
						name="ios-menu"
						style={styles.menuIcon}
						onPress={openMenu}
					/>)}

					<SearchBarInput
						onSearchUpdated={updateHomeSearchState}
						onCancelSearch={cancelSearch}
						registerBackButtonHandler={registerBackButtonHandler}

					/>
				</Header>
				{isSearchMode && searchComponent}
				{!isSearchMode && renderTab()}
				{!isSearchMode && (<Footer>
					<FooterTab style={homeStyle.tabBackground}>
						<Button vertical={true} onPress={switchTab('contacts')}>
							<Icon name="person" style={homeStyle.tabIcon} />
						</Button>
						<Button vertical={true} onPress={switchTab('conversations')}>
							<Icon name="ios-chatbox" style={homeStyle.tabIcon} />
						</Button>
						<Button vertical={true} onPress={switchTab('bubbles')}>
							<Icon name="ios-chatbubbles" style={homeStyle.tabIcon} />
						</Button>
						<Button vertical={true} onPress={switchTab('invitations')}>
							<Icon name="person-add-sharp" style={homeStyle.tabIcon} />
						</Button>
						<Button vertical={true} badge={true} onPress={switchTab('callLogs')}>
							<EventsTabIcon name={'ios-time'} />
						</Button>
					</FooterTab>
				</Footer>)
				}
			</Container>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	header: { borderBottomWidth: 0 },
	headerIcon: { fontSize: 40 },
	tabBackground: { backgroundColor: '#0086CF' },
	tabIcon: { color: '#ffffff' },
	menuIcon: {
		color: 'white',
		marginTop: 5,
		marginLeft: 5,
		alignSelf: 'center',
		fontSize: 50
	}
});
