## Background

VIM (Volunteer Information Manager) is a volunteer management system for participatory events. As much as possible the functionality is implemented in a general purpose [Meteor module](https://github.com/goingnowhere/meteor-volunteers), the intention of which is to be a reusable dependency for other volunteer run events and projects.

## Development

When running, the volunteer facing site is at http://localhost:3000/

Dev credentials:
- Admin: admin@nobodies.team / testtest
- Manager: manager@nobodies.team / testtest
- Normal user: normal@nobodies.team / testtest

It was originally written in Coffeescript using Blaze as the view layer. In order to increase the pool of potential contributors and to escape the poor development experience of Blaze it is currently being ported to React and Javascript. This leads to some odd behaviour at the moment as it's currently using both technologies at the same time.

## Installing

### Git submodule install

To run this project you must [install meteor](https://www.meteor.com/install) and checkout all additional modules. This can be done in one step by using git submodules, though it may require you to have a Github and Gitlab accounts set up with SSH keys set up (all the code is public but since we use SSH urls for the repositories hosted on Github and Gitlab you need an account, an [alternative install method](#non-ssh-install) exists if you don't want to set this up):

``` bash
git clone git@github.com:nobodies-collective/vim.git --recurse-submodules
cd vim
cp server/env.example server/env.json
# If you missed the '--recurse-submodules' above, then add this step to get them:
# git submodule update --init
meteor npm install
meteor
```

### Non-submodule install

If for some reason you don't want to use submodules, you'll need to clone each dependency in turn and tell Meteor where to find them when you run it:

``` bash
mkdir vim-dev
cd vim-dev
git clone https://github.com/nobodies-collective/vim.git
# main meteor-volunteers dependency
git clone https://github.com/goingnowhere/meteor-volunteers.git
# dependencies
git clone https://gitlab.com/piemonkey/meteor-autoform-components.git
git clone https://github.com/abate/meteor-autoform-datetimepicker.git
git clone https://gitlab.com/piemonkey/meteor-user-profiles.git
git clone https://github.com/abate/meteor-autoform.git
git clone https://github.com/piemonkey/emailForms.git
git clone https://github.com/piemonkey/meteor-pages.git
git clone https://github.com/piemonkey/accounts-ui.git
# install npm dependencies and run
cd vim
meteor npm install
METEOR_PACKAGE_DIRS=../ meteor
```

update all submodules to master

```
git submodule foreach 'git pull origin master'
```
