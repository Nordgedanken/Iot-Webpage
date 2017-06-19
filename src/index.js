import React from 'react';
import ReactDOM from 'react-dom';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { ThemeProvider } from 'react-css-themr';
import theme from './theme';
import Home from './pages/Home';
import Notification from 'react-web-notification';

//allow react dev tools work
window.React = React;

class Index extends React.Component {
    constructor() {
        super();
        this.state = {
            drawerActive: false
        };
    }

    toggleDrawerActive = () => {
        this.setState({ drawerActive: !this.state.drawerActive });
    };

    render() {
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <Layout className="main_content">
                        <NavDrawer active={this.state.drawerActive}
                                   onOverlayClick={ this.toggleDrawerActive }>
                            <p>
                                Navigation, account switcher, etc. go here.
                            </p>
                        </NavDrawer>
                        <Panel>
                            <AppBar leftIcon='menu' onLeftIconClick={ this.toggleDrawerActive } />
                            <div>
                                <h1>Main Content</h1>
                                <Home/>
                            </div>
                        </Panel>
                    </Layout>
                </ThemeProvider>
                <Notification title="test" />
            </div>
        );
    }
}

ReactDOM.render(<Index/>, document.getElementById('content'));