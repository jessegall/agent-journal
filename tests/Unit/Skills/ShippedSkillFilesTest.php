<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Contracts\Skills\Skill;
use App\Support\CanonicalRenderer;
use App\Support\MarkdownParts;
use App\Support\Shipped\AccessSkill;
use App\Support\Shipped\JournalSkill;
use App\Support\Shipped\ProfilesSkill;
use App\Support\Shipped\ShellSkill;
use App\Support\Shipped\SkillsSkill;
use App\Values\SkillOwner;
use Domain\Chat\ChatDomain;
use Domain\Chat\Support\Skills\ChatSkill;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Support\Skills\MemorySkill;
use Domain\Plans\PlansDomain;
use Domain\Plans\Support\Skills\PlanSkill;
use Domain\Reminders\RemindersDomain;
use Domain\Reminders\Support\Skills\RemindersSkill;
use Domain\Rules\RulesDomain;
use Domain\Rules\Support\Skills\RulesSkill;
use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Support\Skills\SequencesSkill;
use Domain\Tasks\Support\Skills\TasksSkill;
use Domain\Tasks\TasksDomain;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * Every shipped skill names its Markdown file and renders from it: its purpose and every ## heading of the file are
 * published, in the file's order.
 */
final class ShippedSkillFilesTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class, MemoryDomain::class, PlansDomain::class, RemindersDomain::class, RulesDomain::class, SequencesDomain::class, TasksDomain::class);
    }

    /**
     * @return iterable<string, array{class-string<Skill>, string, string, string}>
     */
    public static function shippedSkills(): iterable
    {
        yield 'Journal' => [JournalSkill::class, '', '', 'resources/skills/core/journal.md'];

        yield 'Profiles' => [ProfilesSkill::class, '', '', 'resources/skills/core/profiles.md'];

        yield 'Shell' => [
            ShellSkill::class,
            'Commands run through the journal, which keeps their output.',
            '',
            'resources/skills/core/shell.md',
        ];

        yield 'Skills' => [SkillsSkill::class, '', '', 'resources/skills/core/skills.md'];

        yield 'Access' => [
            AccessSkill::class,
            'Access decides who may use the journal and what an agent may do.',
            '',
            'resources/skills/core/access.md',
        ];

        yield 'Messages' => [
            ChatSkill::class,
            'Messages are how users and agents talk in the journal.',
            'Chat',
            'domain/Chat/resources/skills/messages.md',
        ];

        yield 'Memory' => [
            MemorySkill::class,
            'Memories keep what matters beyond your context window.',
            'Memory',
            'domain/Memory/resources/skills/memory.md',
        ];

        yield 'Plans' => [
            PlanSkill::class,
            'A plan orders the work: phases of tasks, worked one phase after another.',
            'Plans',
            'domain/Plans/resources/skills/plans.md',
        ];

        yield 'Reminders' => [
            RemindersSkill::class,
            'Reminders are things to do at a time.',
            'Reminders',
            'domain/Reminders/resources/skills/reminders.md',
        ];

        yield 'Rules' => [
            RulesSkill::class,
            'Rules are what every agent of the project must follow.',
            'Rules',
            'domain/Rules/resources/skills/rules.md',
        ];

        yield 'Sequences' => [
            SequencesSkill::class,
            'Sequences are steps you follow one at a time.',
            'Sequences',
            'domain/Sequences/resources/skills/sequences.md',
        ];

        yield 'Tasks' => [
            TasksSkill::class,
            'A task is one unit of work, from open to finished.',
            'Tasks',
            'domain/Tasks/resources/skills/tasks.md',
        ];
    }

    /**
     * @param  class-string<Skill>  $class
     */
    #[DataProvider('shippedSkills')]
    public function test_a_shipped_skill_publishes_its_purpose_and_every_heading_of_its_file(
        string $class,
        string $purpose,
        string $domain,
        string $file,
    ): void {
        $root = $domain === '' ? base_path() : base_path("domain/{$domain}");
        $rendered = new CanonicalRenderer($this->app->make(MarkdownParts::class))->render(
            new $class(),
            new SkillOwner('Owner', $root, [], true),
        )->markdown;

        preg_match_all('/^## (.+)$/m', $rendered, $published);
        preg_match_all('/^## (.+)$/m', (string) file_get_contents(base_path($file)), $written);

        $this->assertSame($purpose === '' ? $written[1] : ['Purpose', ...$written[1]], $published[1]);
        $this->assertStringContainsString($purpose === '' ? "\n# " : <<<TEXT
        ## Purpose

        {$purpose}

        TEXT, $rendered);
    }
}
