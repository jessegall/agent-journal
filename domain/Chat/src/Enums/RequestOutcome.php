<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What became of a send or a reply the browser made under a request key, as far as the caller may know.
 */
#[TypeScript]
enum RequestOutcome: string
{
    case Confirmed = 'confirmed';
    case Refused = 'refused';
    case NotYetObservable = 'not-yet-observable';
    case Expired = 'expired';
    case NoLongerVisible = 'no-longer-visible';
}
