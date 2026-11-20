<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

enum UploadType: string
{
    case DocumentBody = 'document_body';
    case EditReplacement = 'edit_replacement';
    case ReportBody = 'report_body';
}
