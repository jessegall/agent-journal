<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Domains\Support\DomainEntry;
use App\Processes\Enums\ScopeType;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Values\CommandRule;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\TestCase;

/**
 * A module declares its own programs through ProvidesCommandRules; the domain foundation hands them to Core without
 * Core importing the module, and Core holds them for review.
 */
final class CommandRuleDiscoveryTest extends TestCase
{
    public function test_a_test_module_declares_its_own_program_and_it_waits_for_review(): void
    {
        $held = CommandRuleRegistry::from(DomainEntry::fromClass(NotesDomain::class)->commandRules())->awaitingReview();
        $notes = array_values(array_filter($held, fn (CommandRule $rule): bool => $rule->id === 'notes.notes-cli.list'));

        $this->assertCount(1, $notes);
        $this->assertSame(ScopeType::Module, $notes[0]->scope->type);
        $this->assertSame('notes-cli', $notes[0]->program->family);
    }

    public function test_the_application_builds_its_rule_registry_from_core_and_the_domains(): void
    {
        $this->assertInstanceOf(CommandRuleRegistry::class, $this->app->make(CommandRuleRegistry::class));
    }
}
