import React from 'react';
// page to see blog posts

const ChildComponent: React.FC = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aws/dynamodb/users/getUsers`
    );

    const users = await res.json();

    console.log(users);
  } catch (error) {
    console.log(error);
  }

  return <div>Hello</div>;
};

export default ChildComponent;
