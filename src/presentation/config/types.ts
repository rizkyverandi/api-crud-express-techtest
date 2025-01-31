import UserCommandService from "../../application/services/User/Commands/UserCommandService";
import UserQueryService from "../../application/services/User/Queries/UserQueryService";

const TYPES = {
    UserCommandService: Symbol.for("UserCommandService"),
    UserQueryService: Symbol.for("UserQueryService"),
    UserRepository: Symbol.for("UserRepository"),
  };
  
  export { TYPES };