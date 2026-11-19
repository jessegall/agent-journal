<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Skills\Contracts\SkillResolver;
use App\Skills\Values\SkillKey;
use Illuminate\Support\Facades\Artisan;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Tasks, Chat, Memory, Rules, Sequences, Reminders and Access each supply their own skill under its version 5 key;
 * Processes is Core, so Core supplies journal-shell.
 */
final class DomainSkillsTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * @return iterable<string, array{string, string, string}>
     */
    public static function domainSkills(): iterable
    {
        yield 'Tasks' => ['journal-tasks', 'Tasks', '## The tasks you hold'];
        yield 'Chat' => ['journal-messages', 'Chat', '## Answering'];
        yield 'Memory' => ['journal-memory', 'Memory', '## Weights'];
        yield 'Rules' => ['journal-rules', 'Rules', '## Reading rules'];
        yield 'Sequences' => ['journal-sequences', 'Sequences', '## Following a run'];
        yield 'Reminders' => ['journal-reminders', 'Reminders', '## In this version'];
        yield 'Processes' => ['journal-shell', 'Core', '## Reading output'];
        yield 'Access' => ['journal-access', 'Access', '## Agents'];
    }

    #[DataProvider('domainSkills')]
    public function test_each_domain_owns_its_skill_and_show_prints_it(
        string $key,
        string $owner,
        string $heading,
    ): void {
        Artisan::call('skill:list', ['--json' => true]);
        $owners = array_column(json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR), 'owner', 'key');

        $this->assertSame($owner, $owners[$key]);

        Artisan::call('skill:show', ['key' => $key]);
        $shown = Artisan::output();

        $this->assertSame(
            $this->app->make(SkillResolver::class)->find(SkillKey::from($key))->rendered->markdown,
            $shown,
        );
        $this->assertStringContainsString(<<<'TEXT'

        ## Purpose


        TEXT, $shown);
        $this->assertStringContainsString(<<<TEXT

        {$heading}


        TEXT, $shown);
    }
}
