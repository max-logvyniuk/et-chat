import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter'
import UserService from "../../services/UserService";

async function getAllUsersEmail() {
  const allUsers = await UserService.getAllUsers();
  const allUsersFiltered = filter(allUsers,user => !isEmpty(user.email));
  const allUsersEmail = map(allUsersFiltered, user => {
    if (!isEmpty(user.email)) {
      const email = user.email;
      return email;
    }
  });
  return allUsersEmail
}


export default getAllUsersEmail;
