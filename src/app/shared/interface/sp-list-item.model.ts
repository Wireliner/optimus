export interface SpListItem {
  Id?: number;
  ID?: number;
  Attachments?: boolean;
  AttachmentFiles?: {
    results?: SpListItemAttachmentFiles[];
  };
  ['odata.type']?: string;
  ['odata.id']?: string;
  ['odata.etag']?: string;
  ['odata.editLink']?: string;
  __metadata?: {
    type?: string;
  };
}

export interface SpListItemAttachmentFiles {
  FileName: string;
  FileNameAsPath: {
    DecodedUrl: string;
  };
  ServerRelativePath: {
    DecodedUrl: string;
  };
  ServerRelativeUrl: string;
}

export interface SpListItemAttachmentFile {
  FileName: string;
  FileNameAsPath: {
    DecodedUrl: string;
  };
  ServerRelativePath: {
    DecodedUrl: string;
  };
  ServerRelativeUrl: string;
}

export interface SpGetListItemResult {
  d: SpListItem;
}
