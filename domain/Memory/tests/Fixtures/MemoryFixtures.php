<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Fixtures;

use Domain\Memory\Models\Memory;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\JournalSeed;

/**
 * The memories of named agents, kept under the names a test gives them: each starts at revision 1, and its text,
 * weight and revision are asserted together.
 */
final class MemoryFixtures
{
    private readonly FixtureAliases $aliases;

    public function __construct(private readonly JournalSeed $journal)
    {
        $this->aliases = new FixtureAliases('MemoryFixtures');
    }

    public function memory(string $name, string $agent, string $text, int $weight = 5): self
    {
        $this->aliases->claim($name);
        $this->aliases->remember($name, Memory::create($this->journal->actorCalled($agent), $text, $weight));

        return $this;
    }

    public function memoryCalled(string $name): Memory
    {
        return $this->aliases->model(Memory::class, $name);
    }

    public function assertRevision(string $name, int $revision, int $weight, string $text): self
    {
        $memory = $this->memoryCalled($name);

        Assert::assertSame([$revision, $weight, $text], [$memory->revision, $memory->weight, $memory->text]);

        return $this;
    }

    /**
     * No memory is left under the id the name was given.
     */
    public function assertForgotten(string $name): self
    {
        $left = Memory::query()->withoutGlobalScopes()->whereKey($this->aliases->read(Memory::class, $name))->count();

        Assert::assertSame(0, $left, "The memory {$name} is still kept.");

        return $this;
    }
}
