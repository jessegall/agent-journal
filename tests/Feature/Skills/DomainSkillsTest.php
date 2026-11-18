<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Skills\Contracts\SkillReader;
use App\Skills\Values\SkillKey;
use Illuminate\Support\Facades\Artisan;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Tasks, Chat, Memory and Rules each supply their own skill under its version 5 key.
 */
final class DomainSkillsTest extends TestCase
{
    /**
     * @return iterable<string, array{string, string, string}>
     */
    public static function domainSkills(): iterable
    {
        yield 'Tasks' => ['journal-tasks', 'Tasks', '## The tasks you hold'];
        yield 'Chat' => ['journal-messages', 'Chat', '## Answering'];
        yield 'Memory' => ['journal-memory', 'Memory', '## Weights'];
        yield 'Rules' => ['journal-rules', 'Rules', '## Reading rules'];
    }

    #[DataProvider('domainSkills')]
    public function test_each_domain_owns_its_skill_and_show_prints_it(string $key, string $owner, string $heading): void
    {
        Artisan::call('skill:list', ['--json' => true]);
        $owners = array_column(json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR), 'owner', 'key');

        $this->assertSame($owner, $owners[$key]);

        Artisan::call('skill:show', ['key' => $key]);
        $shown = Artisan::output();

        $this->assertSame($this->app->make(SkillReader::class)->find(SkillKey::from($key))->rendered->markdown, $shown);
        $this->assertStringContainsString("\n## Purpose\n\n", $shown);
        $this->assertStringContainsString("\n{$heading}\n\n", $shown);
    }
}
