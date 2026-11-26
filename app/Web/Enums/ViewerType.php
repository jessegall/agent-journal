<?php

declare(strict_types=1);

namespace App\Web\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Who views a page: no one signed in, the owner, or an admitted inbox member who sees only the inboxes it is in.
 */
#[TypeScript]
enum ViewerType: string
{
    case Guest = 'guest';
    case Owner = 'owner';
    case InboxMember = 'inbox-member';
}
