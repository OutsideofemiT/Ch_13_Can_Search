// src/api/API.tsx
const searchGithub = async () => {
  try {
    const start = Math.floor(Math.random() * 100000000) + 1;
    
    // 1. Fetch the basic user list
    const response = await fetch(`https://api.github.com/users?since=${start}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    });
    const basicUsers = await response.json();

    if (!response.ok) {
      throw new Error('invalid API response, check the network tab');
    }

    // 2. Fetch detailed info for each user
    const detailedUsers = await Promise.all(
      basicUsers.map(async (user: any) => {
        // user.login is the username we need to fetch details
        const details = await searchGithubUser(user.login);
        // Merge the basic info (user) with the detailed info (details)
        return { ...user, ...details };
      })
    );

    return detailedUsers;
  } catch (err) {
    return [];
  }
};

const searchGithubUser = async (username: string) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('invalid API response, check the network tab');
    }

    return data;
  } catch (err) {
    return {};
  }
};

console.log(import.meta.env.VITE_GITHUB_TOKEN);

export { searchGithub, searchGithubUser };
