


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Check, Pencil, X } from 'lucide-react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useApp(); // ✅ Use context instead of props

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: 'No address provided'
  });

  const [editData, setEditData] = useState(profileData);

  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || 'No address provided'
      };

      setProfileData(userData);
      setEditData(userData);
    }
  }, [user]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(editData);
      setProfileData(editData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleChange = (field, value) =>
    setEditData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ✅ Header now reads everything from context */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 mb-8">Manage your account information and preferences</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-blue-100 mb-4">{profileData.email}</p>
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full">
                <Check className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Verified Account</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-800">Not specified</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <CreditCard className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Account ID</p>
                  <p className="font-medium text-gray-800">68f8c7d7...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>

                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                  >
                    <Pencil className="w-4 h-4" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                  </div>
                )}
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* First Name */}
                <ProfileInput
                  icon={<User className="w-5 h-5 text-gray-400" />}
                  label="First Name"
                  value={isEditing ? editData.firstName : profileData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  editable={isEditing}
                />

                {/* Last Name */}
                <ProfileInput
                  icon={<User className="w-5 h-5 text-gray-400" />}
                  label="Last Name"
                  value={isEditing ? editData.lastName : profileData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  editable={isEditing}
                />

                {/* Email */}
                <ProfileInput
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                  label="Email Address"
                  value={isEditing ? editData.email : profileData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  editable={isEditing}
                />

                {/* Phone */}
                <ProfileInput
                  icon={<Phone className="w-5 h-5 text-gray-400" />}
                  label="Phone Number"
                  value={isEditing ? editData.phone : profileData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  editable={isEditing}
                />

                {/* Address (full width) */}
                <ProfileInput
                  icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  label="Address"
                  className="md:col-span-2"
                  value={isEditing ? editData.address : profileData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  editable={isEditing}
                />

              </div>
            </div>

            {/* Extra Settings Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccountSettingCard title="Security Settings" desc="Manage password and security options" />
                <AccountSettingCard title="Notification Preferences" desc="Control your notification settings" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileInput({ icon, label, value, onChange, editable, className }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        {icon}
        {editable ? (
          <input
            value={value}
            onChange={onChange}
            className="flex-1 bg-transparent outline-none text-gray-800"
          />
        ) : (
          <span className="text-gray-800">{value}</span>
        )}
      </div>
    </div>
  );
}

function AccountSettingCard({ title, desc }) {
  return (
    <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition cursor-pointer">
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
