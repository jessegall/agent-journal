<?php

declare(strict_types=1);

namespace App\Attributes;

use Attribute;

/**
 * The write owner's declaration on its event that another domain's listener enforces an invariant of the write, so
 * that listener may run in the command's transaction.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final readonly class RequiresListener
{
    /**
     * @param  class-string  $listener
     */
    public function __construct(public string $listener) {}
}
