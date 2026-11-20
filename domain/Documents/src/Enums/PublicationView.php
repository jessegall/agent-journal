<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

enum PublicationView: string
{
    case Summary = 'summary';
    case Body = 'body';
    case Revisions = 'revisions';
    case Comments = 'comments';
}
