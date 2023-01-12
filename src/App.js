import './App.css';
import { Router, Switch } from 'react-router-dom';
import Login from './pages/Auth/Login';
import { AuthTemplate } from './templates/AuthTemplate/AuthTemplate';
import Register from './pages/Auth/Register';
import Loading from './components/GlobalSetting/Loading/Loading';
import { history } from './util/libs/history';
import { JiraBugsTemplate } from './templates/JiraBugsTemplate/JiraBugsTemplate';
import Board from './pages/Project/Board/Board';
import ProjectSetting from './pages/Project/Settings/ProjectSetting';
import ProjectManagement from './pages/Project/ProjectManagement/ProjectManagement';
import ViewProjectModal from './pages/Project/Modal/ViewProjectModal';
import EditProjectDrawer from './pages/Project/Drawer/EditProjectDrawer';
import CreateTaskModal from './pages/Project/Modal/CreateTaskModal';
import ViewTaskModal from './pages/Project/Modal/ViewTaskModal';
import Account from './pages/Auth/Account';
import ProjectUsers from './pages/UserForms/ProjectUsers';
import CreateTask from './pages/TaskForms/CreateTask';
import Task from "./pages/Task/Task";
import EditProject from "./pages/Project/Form/EditProject";
import { setCookie } from './util/libs/cookie';

function App() {
  //setCookie('isRoot', true);
  //setCookie('login', 'userLogin');
  return (
    <Router history={history}>
      <Loading />
      <ViewProjectModal />
      <EditProjectDrawer />
      <CreateTaskModal />
      <ViewTaskModal />

      <Switch>

        {/* AuthTemplate */}
        < AuthTemplate exact path='/login' Component={Login} />
        <AuthTemplate exact path='/register' Component={Register} />

        {/* Jira Bugs Template */}
        <JiraBugsTemplate exact path="/project/:id" Component={Board} title="Доска задач" />
        <JiraBugsTemplate exact path="/project-management/settings" Component={ProjectSetting} title="Настройки проекта" />

        {/* Project Management */}
        <JiraBugsTemplate exact path="/project-management" Component={ProjectManagement} title="Управление проектом" />

        {/* Project Management */}
        <JiraBugsTemplate exact path="/account" Component={Account} title="Аккаунт" />

        {/* User Management */}
        <JiraBugsTemplate exact path="/project/:id/users" Component={ProjectUsers} />

        {/* User Management */}
        <JiraBugsTemplate exact path="/project/:id/settings" Component={EditProject} />

        {/* Task create */}
        <JiraBugsTemplate exact path="/project/:id/task/create/" Component={CreateTask} title="Создание задачи" />

        {/* Task view */}
        <JiraBugsTemplate exact path="/project/:id/task/:taskId" Component={Task} title="Содержание задачи" />

        <AuthTemplate path='/' Component={Login} />
        {/* <JiraBugsTemplate exact path="/" Component={Board} title="Kanban Board" /> */}
      </Switch>
    </Router>
  );
}

export default App;
