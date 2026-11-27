<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\ClaimHostInstructions\ClaimHostInstructionsCommand;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\WriteHostInput\WriteHostInputCommand;
use App\Hosts\Enums\DriverImageStatus;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostProcessType;
use App\Hosts\Protocol\Payloads\HostInstructionPayload;
use App\Hosts\Protocol\Payloads\HostInventoryPayload;
use App\Hosts\Values\HostInstructionClaim;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Support\AgentImage;
use App\Values\HostInstructionSource;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host's claim takes every instruction waiting for it, signed, and an instruction once claimed is not handed out again at once;
 * the answer names the idle window the journal is configured with.
 */
#[TestsCommand(ClaimHostInstructionsCommand::class)]
final class ClaimHostInstructionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_every_waiting_instruction_is_claimed_signed_and_not_handed_out_twice(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('second')->openProcess('first'));
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        [$open] = $this->journal->hostInstructionsOf('first');

        $claim = $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));
        $again = $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));

        $instructions = array_column(array_map(fn (HostInstructionPayload $instruction) => $instruction->toArray(), $claim->instructions), null, 'id');
        $this->journal->assertResult(
            [2, Host::query()->whereKey($hostId)->sole()->signInstruction($open->refresh()), HostInstructionStatus::Claimed, true],
            [count($instructions), $instructions[$open->id]['signature'], $open->status, $again->isEmpty()],
        );
    }

    public function test_a_claimed_input_instruction_whose_answer_never_came_is_handed_out_again(): void
    {
        $claimedAt = CarbonImmutable::parse('2026-11-26 10:00:00');
        $this->journal
            ->useServerClockAt($claimedAt)
            ->enrollHost('Mac', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell', HostProcessType::Pipe));
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        [$open] = $this->journal->hostInstructionsOf('shell');
        $this->journal->hostInstruction($open, fn (TestHostInstruction $instruction) => $instruction
            ->answer())->hostProcess('shell', fn (TestHostProcess $shell) => $shell
            ->report(HostProcessReportType::Running));
        $input = $this->journal->asSystem(new WriteHostInputCommand(
            $this->journal->hostProcessCalled('shell')->id,
            "hello\n",
            HostInstructionSource::fromJournal(),
        ));
        $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));

        $soon = $this->journal->useServerClockAt($claimedAt->addSeconds(5))->asSystem(new ClaimHostInstructionsCommand($hostId, 10));
        $later = $this->journal
            ->useServerClockAt($claimedAt->addSeconds(HostInstruction::CLAIM_SECONDS + 1))
            ->asSystem(new ClaimHostInstructionsCommand($hostId, 10));

        $this->journal->assertResult(
            [true, HostInstruction::CLAIM_SECONDS - 5, [$input]],
            [
                $soon->isEmpty(),
                $soon->retakeableInSeconds,
                array_map(fn (HostInstructionPayload $instruction) => $instruction->id, $later->instructions),
            ],
        );
    }

    public function test_a_host_claims_none_of_another_hosts_instructions(): void
    {
        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->enrollHost('Other', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openProcess('shell'));

        $claim = $this->journal->asSystem(new ClaimHostInstructionsCommand($this->journal->hostCalled('Other')->hostId, 10));

        $this->journal->assertResult(true, $claim->isEmpty());
    }

    public function test_the_answer_names_the_configured_idle_window(): void
    {
        config(['journal.agents.idle_window_seconds' => 42]);
        $this->journal->enrollHost('Mac', [base_path()]);

        $claim = $this->journal->asSystem(new ClaimHostInstructionsCommand($this->journal->hostCalled('Mac')->hostId, 10));

        $this->journal->assertResult(42, $claim->reply()->idleWindowSeconds);
    }

    public function test_a_contained_host_is_ordered_the_agent_image_once_and_again_after_its_restart(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $inventory = HostInventoryPayload::from([
            'protocol' => 1,
            'release' => '6.0.0',
            'capabilities' => [],
            'processes' => [],
        ]);

        $first = $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));
        $second = $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));
        $this->journal->asSystem(new NotifyHostInventoryCommand($hostId, $inventory));
        $afterRestart = $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));

        $typesOf = fn (HostInstructionClaim $claim) => array_map(
            fn (HostInstructionPayload $instruction) => $instruction->type,
            $claim->instructions,
        );
        $image = $this->journal->service(AgentImage::class)->reference;
        // The first claim also builds the host's driver images, one per deployed recipe, and a later claim none again;
        // the restart refused the builds it had claimed, so the claim after it builds them again.
        $builds = ['build_image', 'build_image', 'allow_images'];
        $this->journal->assertResult(
            [$builds, [], $builds, ['images' => [$image]]],
            [
                $typesOf($first),
                $typesOf($second),
                $typesOf($afterRestart),
                $this->journal->payloadOf($this->firstAllowOn('Box')),
            ],
        );
    }

    public function test_a_container_is_not_handed_out_until_the_host_answered_the_agent_image(): void
    {
        $this->journal
            ->enrollContainedHost('Box', [base_path()])
            ->host('Box', fn (TestEnrolledHost $box) => $box->openContainer('probe'));
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $typesOf = fn (HostInstructionClaim $claim) => array_map(
            fn (HostInstructionPayload $instruction) => $instruction->type,
            $claim->instructions,
        );

        $whileAllowing = $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));
        $this->journal->hostInstruction(
            $this->firstAllowOn('Box'),
            fn (TestHostInstruction $allow) => $allow->answerWith(['allowed' => 1, 'absent' => []]),
        );
        $onceAllowed = $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));

        $this->journal->assertResult(
            [['build_image', 'build_image', 'allow_images'], ['open_container']],
            [$typesOf($whileAllowing), $typesOf($onceAllowed)],
        );
    }

    public function test_a_cold_contained_host_reaches_one_ready_image_per_recipe_with_no_build_sent_twice(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));
        $whileBuilding = $this->journal->asSystem(new ClaimHostInstructionsCommand($hostId, 10));

        foreach ($this->openOn('Box', HostInstructionType::BuildImage) as $number => $build) {
            $this->journal->hostInstruction($build, fn (TestHostInstruction $built) => $built->answerWith([
                'image' => 'sha256:'.str_repeat((string) ($number + 4), 64),
                'history' => ['RUN sh /opt/journal/checks/driver-image.sh'],
                'stdout' => '',
                'stderr' => '',
                'exit_code' => 0,
            ]));
        }

        // The first set, of the base alone, is still out; the set that names the built images follows its answer.
        $answerOpenSet = fn () => $this->journal->hostInstruction(
            $this->openOn('Box', HostInstructionType::AllowImages)[0],
            fn (TestHostInstruction $allow) => $allow->answerWith(['allowed' => 3, 'absent' => []]),
        );
        $answerOpenSet();
        $answerOpenSet();

        foreach ($this->openOn('Box', HostInstructionType::RunContainers) as $checks) {
            $passing = ['exitCode' => 0, 'stdout' => "10002\n", 'stderr' => '', 'isTruncated' => false];
            $runs = count($this->journal->payloadOf($checks)['runs']);
            $results = array_fill(0, $runs, [...$passing, 'isTimedOut' => false]);
            $this->journal->hostInstruction(
                $checks,
                fn (TestHostInstruction $run) => $run->answerWith(['results' => $results]),
            );
        }

        $this->journal->assertResult(
            [[], [DriverImageStatus::Ready, DriverImageStatus::Ready]],
            [
                $whileBuilding->instructions,
                HostDriverImage::query()->where('host_id', $hostId)->orderBy('id')->pluck('status')->all(),
            ],
        );
    }

    /**
     * The host's instructions of the type it has not answered yet, oldest first.
     *
     * @return list<HostInstruction>
     */
    private function openOn(string $host, HostInstructionType $type): array
    {
        return array_values(array_filter(
            $this->journal->hostInstructionsOn($host),
            fn (HostInstruction $made) => $made->type === $type && $made->answered_at === null,
        ));
    }

    private function firstAllowOn(string $host): HostInstruction
    {
        $allows = array_filter(
            $this->journal->hostInstructionsOn($host),
            fn (HostInstruction $made) => $made->type === HostInstructionType::AllowImages,
        );

        return reset($allows) ?: $this->fail("no allow_images was placed on {$host}");
    }
}
