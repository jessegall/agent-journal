<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\CommandRules\CommandRuleRegistry;
use App\CommandRules\Enums\ScopeType;
use App\Support\DomainEntry;
use App\Values\CommandRule;
use Domain\Rules\RulesDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\TestCase;

/**
 * A module declares its own programs through CommandRuleProvider; the domain foundation hands them to Core without
 * Core importing the module, and Core holds them for review.
 */
final class CommandRuleDiscoveryTest extends TestCase
{
    protected static function bootedDomains(): array
    {
        // The notes module requires the rules domain, which its entry checks as it is read.
        return [RulesDomain::class];
    }

    public function test_a_test_module_declares_its_own_program_and_it_waits_for_review(): void
    {
        $held = CommandRuleRegistry::from(DomainEntry::fromClass(NotesDomain::class)->commandRules())->awaitingReview();
        $notes = array_values(
            array_filter($held, fn (CommandRule $rule): bool => $rule->id === 'notes.notes-cli.list'),
        );

        $this->assertCount(1, $notes);
        $this->assertSame(ScopeType::Module, $notes[0]->scope->type);
        $this->assertSame('notes-cli', $notes[0]->program->family);
    }
}
