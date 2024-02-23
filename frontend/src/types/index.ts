export type FormErros = {
  [key: string]: any;
};

export type ResponseMessage = {
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  description: string;
};
