import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './App/Screens/Home';
import Layout from './App/Screens/Layout';
import './App.css';
import Login from './App/Screens/Auth/Login';
import Register from './App/Screens/Auth/Register';
import UserLayout from './App/Screens/User/Layout';
import UserDashboard from './App/Screens/User/Screens/Dashboard';
import Verify from './App/Screens/Auth/Verify';
import Helpers from './App/Config/Helpers';
import AdminLayout from './App/Screens/Admin/Layout';
import AdminDashboard from './App/Screens/Admin/Screens/Dashboard';
import AdminCategories from './App/Screens/Admin/Screens/Categories';
import UserDocument from './App/Screens/User/Screens/Documents.js';
import AdminPromptsMain from './App/Screens/Admin/Screens/PromptsMain';
import AdminPromptQuestions from './App/Screens/Admin/Screens/PromptQuestions';
import PromptTesting from './App/Screens/Admin/Screens/PromptTesting';
import AdminInstructions from './App/Screens/Admin/Screens/Instructions';
import Chatbot from './App/Screens/User/Screens/Chatbot';
import TemplatesLibrary from './App/Screens/User/Screens/TemplatesLibrary';
import UserPromptQuestions from './App/Screens/User/Screens/Questions';
import AdminButtons from './App/Screens/Admin/Screens/Buttons';
import ChatHistory from './App/Screens/User/Screens/History';
import AdminUsers from './App/Screens/Admin/Screens/Users';
import AdminChatHistory from './App/Screens/Admin/Screens/ChatHistory';
import SingleChat from './App/Screens/Admin/Screens/SingleChat';
import AdminChatHistoryUser from './App/Screens/Admin/Screens/ChatHistoryUser';
import UserPricingPlans from './App/Screens/User/Screens/PricingPlans';
import AdminStripeDashboard from './App/Screens/Admin/Screens/Products';
import PaymentScreen from './App/Screens/User/Screens/PaymentScreen';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ForgotPassword from './App/Screens/Auth/ForgotPassword';
import VerifyForgotPassword from './App/Screens/Auth/VerifyForgot';
import RecoverPassword from './App/Screens/Auth/RecoverPassword';
import UserProfile from './App/Screens/User/Screens/UserProfile';
import DragDrop from './App/Screens/Admin/Screens/DragDrop';
import UserCategories from './App/Screens/User/Screens/UserCategories';
import UserPromptsMain from './App/Screens/User/Screens/UserPromptsMain';
import UserQuestionsPrompt from './App/Screens/User/Screens/UserPromptQuestions';
import UserPromptTesting from './App/Screens/User/Screens/UserPromptTesting';
import UserInstructions from './App/Screens/User/Screens/UserInstructions';
import UserButtons from './App/Screens/User/Screens/UserButtons';
import MyTemplatesLibrary from './App/Screens/User/Screens/MyTemplates';
import Prompt from './App/Screens/User/Screens/Prompt.js';
// import Reportprompt  from './App/Screens/User/Screens/Documents.js';
import ReportPrompt from './App/Screens/User/Screens/ReportPrompt.js'
// import Reports from './App/Screens/User/Screens/Prompt.js';
import Reports from './App/Screens/User/Screens/Reports.js' ;
import Chatid from './App/Screens/User/Screens/Chatid.js';
import PricingPlansOld from './App/Screens/User/Screens/PricingPlansOld.js'
import PricingPlans from './App/Screens/Admin/Screens/PricingPlans.js'
import EditUser from './App/Screens/Admin/Screens/EditUser.js';
import Profile from './App/Screens/Admin/Screens/Profile.js'
const stripePromise = loadStripe('pk_test_51O9b0oJVi3wqPduPwga8kOEivIqTmn5t6UFj5VRrP2CWqkN4d4sPFBltB7AGz1s7pg9rxXAgrnfkeMz5MpRdSur500rGXqxQxo');

const Auth = ({ children, isAuth = true, isAdmin = false }) => {
  let user = Helpers.getItem("user", true);
  let token = Helpers.getItem("token");
  let loginTime = Helpers.getItem("loginTimestamp");
  let currentTime = new Date().getTime();
  let minutesPassed = Math.floor((currentTime - loginTime) / (1000 * 60));

  // Check for session expiration
  if (loginTime && minutesPassed > 120) {
    localStorage.clear();
    Helpers.toast("error", "Session expired. Login again to continue");
    return <Navigate to="/login" />;
  }
  // For protected routes
  else if (isAuth) {
    if (!user || !token) {
      Helpers.toast("error", "Please login to continue");
      return <Navigate to="/login" />;
    }

    // Ensure only admins can access admin routes
    if (isAdmin && user.user_type !== 1) {
      Helpers.toast("error", "Access denied. Only admin allowed.");
      return <Navigate to="/user/dashboard" />;
    }

    // Ensure admins cannot access user routes
    if (!isAdmin && user.user_type === 1) {
      Helpers.toast("error", "Access denied. Admins cannot access user routes.");
      return <Navigate to="/admin/dashboard" />;
    }

    return children;
  }
  // For non-protected routes like /login
  else {
    if (user && token) {
      if (user.user_type === 1) {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/user/dashboard" />;
      }
    }
    return children;
  }
}

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Auth isAuth={false}><Login /></Auth>} />
          <Route path='/register' element={<Auth isAuth={false}><Register /></Auth>} />
          <Route path='/verify-email' element={<Auth isAuth={false}><Verify /></Auth>} />
          <Route path='/forgot-password' element={<Auth isAuth={false}><ForgotPassword /></Auth>} />
          <Route path='/verify-email-password' element={<Auth isAuth={false}><VerifyForgotPassword /></Auth>} />
          <Route path='/recover-password' element={<Auth isAuth={false}><RecoverPassword /></Auth>} />
        </Route>
        <Route path='/user' element={<UserLayout />}>
          <Route path='/user/dashboard' element={<Auth><UserDashboard /></Auth>} />
          <Route path='/user/templates-library' element={<Auth><TemplatesLibrary /></Auth>} />
          <Route path='/user/my-templates-library' element={<Auth><MyTemplatesLibrary /></Auth>} />

          <Route path='/user/chat-history' element={<Auth><ChatHistory /></Auth>} />


          <Route path='/user/chat-history/:chatid' element={<Auth><Chatid /></Auth>} />

          
          <Route path='/user/chat/:chatid' element={<Auth><Chatbot /></Auth>} />
          <Route path='/user/prompt-questions/:prompt_id/:prompt_name' element={<Auth><UserPromptQuestions /></Auth>} />
          <Route path='/user/pricing-plans' element={<Auth><UserPricingPlans /></Auth>} />
          <Route path='/user/profile/:user_id' element={<Auth><UserProfile /></Auth>} />
          <Route path='/user/categories' element={<Auth><UserCategories /></Auth>} />
          <Route path='/user/documents/:chatid' element={<Auth><UserDocument /></Auth>} />
          <Route path='/user/Reports/:chatid' element={<Auth><Reports /></Auth>} />
          <Route path='/user/Prompt' element={<Auth><Prompt /></Auth>} />
          <Route path='/user/Report-Prompt' element={<Auth><ReportPrompt /></Auth>} />
          <Route path='/user/prompts' element={<Auth><UserPromptsMain /></Auth>} />
          <Route path='/user/prompt/questions/:prompt_id/:is_adding?' element={<Auth><UserQuestionsPrompt /></Auth>} />
          <Route path='/user/prompt/:prompt_id' element={<Auth><UserPromptTesting /></Auth>} />
          <Route path='/user/instructions' element={<Auth><UserInstructions /></Auth>} />
          <Route path='/user/buttons' element={<Auth><UserButtons /></Auth>} />
          <Route path='/user/subscribe-product/:plan_id' element={<Auth>
            <Elements stripe={stripePromise}>
              <PaymentScreen />
            </Elements>
          </Auth>} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='/admin/dashboard' element={<Auth isAdmin={true}><AdminDashboard /></Auth>} />
          <Route path='/admin/categories' element={<Auth isAdmin={true}><AdminCategories /></Auth>} />
          <Route path='/admin/prompts' element={<Auth isAdmin={true}><AdminPromptsMain /></Auth>} />
          <Route path='/admin/prompt/:prompt_id' element={<Auth isAdmin={true}><PromptTesting /></Auth>} />
          <Route path='/admin/drag-drop' element={<Auth isAdmin={true}><DragDrop /></Auth>} />
          <Route path='/admin/prompt/questions/:prompt_id/:is_adding?' element={<Auth isAdmin={true}><AdminPromptQuestions /></Auth>} />
          <Route path='/admin/instructions' element={<Auth isAdmin={true}><AdminInstructions /></Auth>} />
          <Route path='/admin/buttons' element={<Auth isAdmin={true}><AdminButtons /></Auth>} />
          <Route path='/admin/users' element={<Auth isAdmin={true}><AdminUsers /></Auth>} />
          <Route path='/admin/chat-history' element={<Auth isAdmin={true}><AdminChatHistory /></Auth>} />
          <Route path='/admin/chat/:chatid' element={<Auth isAdmin={true}><SingleChat /></Auth>} />
          <Route path='/admin/chats/user/:user_id' element={<Auth isAdmin={true}><AdminChatHistoryUser /></Auth>} />
          <Route path='/admin/user/Edit-User/:user_id' element={<Auth isAdmin={true}><EditUser /></Auth>} />
          <Route path='/admin/stripe-products' element={<Auth isAdmin={true}><AdminStripeDashboard /></Auth>} />
          <Route path='/admin/Pricing-Plans' element={<Auth isAdmin={true}><PricingPlans /></Auth>} />
          <Route path='/admin/profile' element={<Auth isAdmin={true}><Profile /></Auth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;