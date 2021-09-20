import bcrypt from "bcrypt";

import client from "../../client";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password: newPassword },
      { loggedInUser, portectResolver }
    ) => {
      // 우리의 토큰을 해독하는 역할을 함. 그럼 우리가 sing 메소드를 사용할때 썼던 유저 아이디가 나온다.
      protectResolver(loggedInUser);
      console.log("loggedINUSER", loggedInUser);
      let hashPassword = null;
      if (newPassword) {
        hashPassword = await bcrypt.hash(newPassword, 10);
      }
      const updateUser = await client.user.update({
        where: { id: loggedInUser.id }, //토큰에서 가져온 아이디로 업데이트 한다
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(hashPassword && { password: hashPassword }),
          //문법 설명 앞에 조건이 트루이면 뒤에 오브젝트를 리턴. 그러면 ...연산자를 이용해 오브젝트 내부의 값들이 다나온다.
          //앞에 해쉬화된 비번이  null이 아니라면 뒤에 오브젝트를
        },
      });
      if (updateUser) {
        return { ok: true };
      } else {
        return { ok: false, error: "Could not update profile." };
      }
    },
  },
};
//undefined를 업데이트하라면 어떡하지?
//prisma는 undefined값을 보내면 update하지 않는다.
