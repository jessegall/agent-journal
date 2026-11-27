<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\BuildHostDriverImage\BuildHostDriverImageCommand;
use App\Hosts\Commands\RecordDriverImageAnswer\RecordDriverImageAnswerCommand;
use App\Hosts\Commands\ReserveHostDriverImages\ReserveHostDriverImagesCommand;
use App\Hosts\Enums\DriverImageStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\HostDriverImage;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The host's answers move a driver image along only from the instruction it waits on: a clean build waits to be
 * allowed, an allowed image is checked, passing checks make it ready; a failed build, a credential in its history, a
 * failing or missing check result refuse it, and an image the daemon lost is built again.
 */
#[TestsCommand(RecordDriverImageAnswerCommand::class)]
final class RecordDriverImageAnswerTest extends TestCase
{
    use RefreshHookDatabase;

    private const string VECTORS = 'programs/runner/hostapi/testdata/conformance.json';

    private HostDriverImage $image;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $this->journal->asSystem(new ReserveHostDriverImagesCommand($hostId));
        $this->image = HostDriverImage::query()->where('host_id', $hostId)->orderBy('id')->firstOrFail();
        $this->journal->asSystem(new BuildHostDriverImageCommand($hostId, $this->image->id));
    }

    public function test_a_clean_build_allowed_and_checked_is_ready(): void
    {
        $built = $this->builtReply();

        $this->answer(HostInstructionType::BuildImage, $built);
        $afterBuild = [$this->image->refresh()->status, $this->image->image];
        $this->answer(HostInstructionType::AllowImages, ['allowed' => 2, 'absent' => []]);
        $checks = $this->latest(HostInstructionType::RunContainers);
        $runs = count($this->journal->payloadOf($checks)['runs']);
        $this->answer(HostInstructionType::RunContainers, ['results' => array_fill(0, $runs, $this->passing())]);

        $this->journal->assertResult(
            [[DriverImageStatus::Allowing, $built['image']], DriverImageStatus::Ready, 0],
            [$afterBuild, $this->image->refresh()->status, $this->image->failures],
        );
    }

    public function test_a_failed_build_or_a_credential_in_its_history_refuses_the_image(): void
    {
        $failed = [...$this->builtReply(), 'exit_code' => 1, 'stderr' => 'no pinned digest'];
        $this->answer(HostInstructionType::BuildImage, $failed);

        $this->journal->assertResult(
            [DriverImageStatus::Refused, true],
            [$this->image->refresh()->status, str_contains((string) $this->image->refusal, 'no pinned digest')],
        );
    }

    public function test_an_image_the_daemon_lost_is_built_again_and_a_failing_check_refuses_it(): void
    {
        $this->answer(HostInstructionType::BuildImage, $this->builtReply());
        $this->answer(HostInstructionType::AllowImages, ['allowed' => 2, 'absent' => [$this->builtReply()['image']]]);
        $lost = [$this->image->refresh()->status, $this->image->failures];

        $this->journal->asSystem(new BuildHostDriverImageCommand($this->image->host_id, $this->image->id));
        $this->answer(HostInstructionType::BuildImage, $this->builtReply());
        // The set without the lost image is still out; the set that names the rebuilt one follows its answer.
        $this->answer(HostInstructionType::AllowImages, ['allowed' => 1, 'absent' => []]);
        $this->answer(HostInstructionType::AllowImages, ['allowed' => 2, 'absent' => []]);
        $asTheProgramUser = [...$this->passing(), 'stdout' => "10001\n"];
        $this->answer(HostInstructionType::RunContainers, ['results' => [$asTheProgramUser]]);

        $this->journal->assertResult(
            [[DriverImageStatus::Pending, 1], DriverImageStatus::Refused],
            [$lost, $this->image->refresh()->status],
        );
    }

    public function test_an_answer_to_an_instruction_the_image_no_longer_waits_on_changes_nothing(): void
    {
        $this->image->refresh()->interrupted('the host restarted');

        $this->answer(HostInstructionType::BuildImage, $this->builtReply());

        $this->journal->assertResult(
            [DriverImageStatus::Pending, 1, null],
            [$this->image->refresh()->status, $this->image->failures, $this->image->image],
        );
    }

    /**
     * The built reply of the committed conformance vectors, the bytes the runner writes for a build.
     *
     * @return array<string, mixed>
     */
    private function builtReply(): array
    {
        $vectors = json_decode((string) file_get_contents(base_path(self::VECTORS)), true, flags: JSON_THROW_ON_ERROR);

        return $vectors['answers'][3]['facts'];
    }

    /**
     * @return array<string, mixed>
     */
    private function passing(): array
    {
        return ['exitCode' => 0, 'stdout' => "10002\n", 'stderr' => '', 'isTruncated' => false, 'isTimedOut' => false];
    }

    /**
     * @param  array<string, mixed>  $facts
     */
    private function answer(HostInstructionType $type, array $facts): void
    {
        $this->journal->hostInstruction(
            $this->latest($type),
            fn (TestHostInstruction $instruction) => $instruction->answerWith($facts),
        );
    }

    private function latest(HostInstructionType $type): HostInstruction
    {
        $ofType = array_filter(
            $this->journal->hostInstructionsOn('Box'),
            fn (HostInstruction $made) => $made->type === $type,
        );

        return end($ofType) ?: $this->fail("no {$type->value} was placed");
    }
}
