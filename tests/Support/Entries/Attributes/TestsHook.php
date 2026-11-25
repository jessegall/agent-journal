<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Enums\Hooks\HookEvent;
use Attribute;

/**
 * A hook moment of one driver protocol a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final readonly class TestsHook
{
    /**
     * @param  string  $protocol  an adapter's hookProtocol(), such as DefaultDrivers::CLAUDE_CODE
     */
    public function __construct(public string $protocol, public HookEvent $moment) {}
}
