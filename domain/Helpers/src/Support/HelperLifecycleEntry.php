<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

/**
 * The trusted entry under which the journal itself changes a helper job after a Core fact about its work committed.
 */
final class HelperLifecycleEntry
{
    public const string NAME = 'helper lifecycle';
}
