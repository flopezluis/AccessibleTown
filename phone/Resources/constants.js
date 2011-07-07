function Constants() {
}
Constants.prototype.base_url = 'http://192.168.1.130:8000';

Constants.prototype.api_url = Constants.prototype.base_url + '/api/v0/';
Constants.prototype.POINT_URL = Constants.prototype.api_url + 'point/'; 
Constants.prototype.DO_LOGIN = Constants.prototype.api_url + 'login/'; 
Constants = new Constants();

