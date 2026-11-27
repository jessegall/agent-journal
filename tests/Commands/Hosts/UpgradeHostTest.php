<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\UpgradeHost\UpgradeHostCommand;
use App\Hosts\Exceptions\HostUpgradeRefused;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostInventoryPayload;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A connected host moves to the published release: its processes are stopped first and the upgrade is ordered once the
 * last one ended.
 */
#[TestsCommand(UpgradeHostCommand::class)]
final class UpgradeHostTest extends TestCase
{
    use RefreshHookDatabase;

    private const string RELEASE = '6.1.0';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->publishRelease(self::RELEASE)->enrollHost('Mac', [base_path()]);
    }

    public function test_a_quiet_host_is_ordered_the_upgrade_with_the_signed_manifest_at_once(): void
    {
        $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE));

        $instruction = $this->journal->hostInstructionsOn('Mac')[0];
        $payload = $this->journal->payloadOf($instruction);
        $this->journal->assertResult(
            [HostInstructionType::Upgrade, self::RELEASE, self::RELEASE, base64_encode('signature'), 'claude', $instruction->id],
            [
                $instruction->type,
                $payload['version'],
                json_decode($payload['manifest'], true, flags: JSON_THROW_ON_ERROR)['version'],
                $payload['signature'],
                json_decode($payload['drivers'], true, flags: JSON_THROW_ON_ERROR)['drivers'][0]['executable'],
                $this->host()->upgrade_instruction_id,
            ],
        );
    }

    public function test_a_host_with_a_live_process_has_it_stopped_and_is_ordered_once_it_ended(): void
    {
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'));

        $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE));
        $stops = $this->journal->hostInstructionsOf('shell');
        $beforeEnd = $this->journal->hostInstructionsOn('Mac');
        $this->journal->hostProcess('shell', fn (TestHostProcess $shell) => $shell
            ->report(HostProcessReportType::Exited, 0));

        $this->journal->assertResult(
            [HostInstructionType::Stop, [], [HostInstructionType::Upgrade]],
            [
                end($stops)->type,
                $beforeEnd,
                array_map(fn ($instruction) => $instruction->type, $this->journal->hostInstructionsOn('Mac')),
            ],
        );
    }

    public function test_a_release_the_journal_does_not_publish_is_refused(): void
    {
        $this->journal->assertRefused(
            HostUpgradeRefused::class,
            fn () => $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), '6.0.9')),
        );
    }

    public function test_a_host_whose_inventory_names_no_upgrade_is_refused(): void
    {
        $body = HostInventoryPayload::from([
            'protocol' => 1,
            'release' => '6.0.0',
            'capabilities' => ['stop'],
            'processes' => [],
        ]);
        $this->journal->asSystem(new NotifyHostInventoryCommand($this->hostId(), $body));

        $this->journal->assertRefused(
            HostUpgradeRefused::class,
            fn () => $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE)),
        );
    }

    public function test_a_new_upgrade_clears_the_failure_of_the_last(): void
    {
        $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE));
        $this->journal->hostInstruction($this->journal->hostInstructionsOn('Mac')[0], fn (TestHostInstruction $instruction) => $instruction
            ->refuse(HostRefusal::Fenced));

        $this->journal->asSystem(new UpgradeHostCommand($this->hostId(), self::RELEASE));

        $this->journal->assertResult(
            [null, self::RELEASE],
            [$this->host()->upgrade_failure, $this->host()->upgrade_release],
        );
    }

    private function hostId(): string
    {
        return $this->journal->hostCalled('Mac')->hostId;
    }

    private function host(): Host
    {
        return Host::query()->whereKey($this->hostId())->sole();
    }
}
