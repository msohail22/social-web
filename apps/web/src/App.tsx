import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import {
  BookmarksPage,
  ChatPage,
  CreatePostPage,
  EditProfilePage,
  ExplorePage,
  FollowersPage,
  FollowingPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  LogoutPage,
  MessagesPage,
  NotFoundPage,
  NotificationsPage,
  PostDetailPage,
  ProfilePage,
  RegisterPage,
  SearchPage,
  SettingsPage,
} from './pages'

function App() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit" element={<EditProfilePage />} />
        <Route path="profile/:username" element={<ProfilePage />} />
        <Route path="profile/:username/followers" element={<FollowersPage />} />
        <Route path="profile/:username/following" element={<FollowingPage />} />
        <Route path="posts/new" element={<CreatePostPage />} />
        <Route path="posts/:postId" element={<PostDetailPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="messages/:chatId" element={<ChatPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="logout" element={<LogoutPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
