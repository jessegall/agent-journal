<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\EnrollHost;
use App\Agents\Enums\ArrangementType;
use App\Agents\Support\ArrangementSetting;
use App\Agents\Support\EnrolledHost;
use App\Hooks\Contracts\ProgramCompatibilities;
use App\Hooks\Exceptions\ProgramArrangementUnproven;
use App\Hooks\Support\ProgramCompatibility;
use App\Programs\Enums\HookProgram;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * Contained, a program's arrangement is shown only by a contained host's report that every item is enforced in the
 * agent image; until then a start is refused naming what is missing (doc 61, decision 7; stories 57, 58).
 */
final class ContainedProgramEvidenceTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array ITEMS = [
        'account-secrets', 'foreign-history', 'keychain', 'control-sockets', 'process-inspection', 'install-writes',
    ];

    public function test_the_local_arrangement_answers_the_pinned_compatibility_as_before(): void
    {
        $this->assertEquals(
            ProgramCompatibility::pinned(HookProgram::ClaudeCode),
            $this->compatibility(HookProgram::ClaudeCode),
        );
    }

    public function test_with_no_report_a_contained_start_is_refused_naming_the_missing_report(): void
    {
        $this->useArrangement(ArrangementType::Contained);

        $this->expectException(ProgramArrangementUnproven::class);
        $this->expectExceptionMessage('no contained host has reported the protection of claude-code 2.1.323');

        $this->compatibility(HookProgram::ClaudeCode)->assertStartable();
    }

    public function test_a_report_with_unenforced_items_refuses_naming_them_and_why(): void
    {
        $this->useArrangement(ArrangementType::Contained);
        $reason = "no native mechanism: Claude Code's sandbox does not start in the agent container: bwrap: no proc";
        $items = $this->items(['account-secrets', 'process-inspection'], $reason);
        $this->report($this->containedHost(), 'claude-code', '2.1.323', $items)->assertNoContent();

        $this->assertThrows(
            fn () => $this->compatibility(HookProgram::ClaudeCode)->assertStartable(),
            ProgramArrangementUnproven::class,
            'claude-code 2.1.323 cannot start in a container: the agent image\'s protection report leaves '
                ."account-secrets, process-inspection unenforced ({$reason}).",
        );
        $this->assertThrows(
            fn () => $this->compatibility(HookProgram::Codex)->assertStartable(),
            ProgramArrangementUnproven::class,
            'codex 0.165.0 cannot start in a container: no contained host has reported the protection of codex '
                .'0.165.0 in the agent image (journal-agent protection --arrangement=contained).',
        );
    }

    public function test_a_report_with_every_item_enforced_admits_a_contained_start(): void
    {
        $this->useArrangement(ArrangementType::Contained);
        $host = $this->containedHost();
        $this->report($host, 'claude-code', '2.1.323', $this->items(['keychain'], 'missing'))->assertNoContent();
        $this->report($host, 'claude-code', '2.1.323', $this->items([], ''))->assertNoContent();

        $this->compatibility(HookProgram::ClaudeCode)->assertStartable();

        $this->assertFalse($this->compatibility(HookProgram::Codex)->arrangementEvidence->isNativeShown());
    }

    private function compatibility(HookProgram $program): ProgramCompatibility
    {
        return $this->app->make(ProgramCompatibilities::class)->for($program);
    }

    private function useArrangement(ArrangementType $arrangement): void
    {
        $this->app->instance(ArrangementSetting::class, ArrangementSetting::fromConfig($arrangement->value, 'journal', '{}'));
    }

    private function containedHost(): EnrolledHost
    {
        $name = 'contained host '.Str::random(6);

        return $this->asSystem(new EnrollHost($name, ['/workspace'], ArrangementType::Contained));
    }

    /**
     * @param  list<array<string, mixed>>  $items
     */
    private function report(EnrolledHost $host, string $program, string $build, array $items): TestResponse
    {
        return $this->hostCall($host, '/host/reports/protection', [
            'program' => $program,
            'build' => $build,
            'platform' => 'linux-container',
            'items' => $items,
        ]);
    }

    /**
     * Every item enforced with evidence, but those named, which give the reason; each item carries both keys, the
     * unused one empty, as journal-agent sends them (client.ProtectionItem).
     *
     * @param  list<string>  $unenforced
     * @return list<array<string, mixed>>
     */
    private function items(array $unenforced, string $reason): array
    {
        return array_map(
            fn (string $item): array => in_array($item, $unenforced, true)
                ? ['item' => $item, 'enforced' => false, 'evidence' => '', 'reason' => $reason]
                : ['item' => $item, 'enforced' => true, 'evidence' => 'run-1', 'reason' => ''],
            self::ITEMS,
        );
    }
}
