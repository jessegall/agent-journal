<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Enums\Hooks\HookEvent;
use Attribute;
use Tests\Support\Entries\Contracts\NamesEntry;

/**
 * A hook moment of one driver protocol a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::IS_REPEATABLE)]
final readonly class TestsHook implements NamesEntry
{
    /**
     * @param  string  $protocol  an adapter's hookProtocol(), such as DefaultDrivers::CLAUDE_CODE
     */
    public function __construct(public string $protocol, public HookEvent $moment) {}

    public function entryName(): string
    {
        return "{$this->protocol} {$this->moment->value}";
    }
}
