import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';

async function testServer() {
  console.log('Testing Clarity Retina Care Backend...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('   Status:', healthData.status);
    console.log('   Timestamp:', healthData.timestamp);
    console.log('');

    // Test registration endpoint
    console.log('2. Testing registration endpoint...');
    const testUser = {
      email: 'test@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    };

    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful');
      console.log('   User ID:', registerData.user._id);
      console.log('   Token received:', !!registerData.token);
      console.log('');

      // Test login endpoint
      console.log('3. Testing login endpoint...');
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful');
        console.log('   User:', loginData.user.firstName, loginData.user.lastName);
        console.log('   Role:', loginData.user.role);
        console.log('');

        // Test protected endpoint
        console.log('4. Testing protected endpoint...');
        const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json',
          }
        });

        if (meResponse.ok) {
          const meData = await meResponse.json();
          console.log('✅ Protected endpoint accessible');
          console.log('   Current user:', meData.user.email);
        } else {
          console.log('❌ Protected endpoint failed');
        }
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
      const errorData = await registerResponse.json();
      console.log('   Error:', errorData.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\nTest completed!');
}

testServer();
