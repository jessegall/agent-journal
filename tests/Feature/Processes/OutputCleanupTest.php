<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\Admission\ShellAdmission;
use App\Enums\CommandRules\AdmissionRefusalCode;
use App\Enums\Processes\ShellDialect;
use App\Models\Runs\PartRun;
use App\Values\Admission;
use App\Values\AdmissionRefusal;
use App\Values\ExecutionContext;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A full output disk starts nothing until room returns.
 */
final class OutputCleanupTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;

    private PartRun $part;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
        $this->part = $this->normalRun(0, self::PASSED_OUTPUT);
    }

    public function test_a_full_output_disk_starts_nothing_until_room_returns(): void
    {
        config(['processes.runner' => true, 'processes.minimum_free_bytes' => PHP_INT_MAX]);
        $full = $this->admitCat('key-1')->decision;
        $this->assertInstanceOf(AdmissionRefusal::class, $full);
        $this->assertSame(AdmissionRefusalCode::RunnerUnavailable, $full->code);

        config(['processes.minimum_free_bytes' => 0]);
        $this->assertTrue($this->admitCat('key-2')->isAllowed());
    }

    private function admitCat(string $key): Admission
    {
        $this->start->startRequest($this->app);

        return $this->app->make(ShellAdmission::class)
            ->admit('cat composer.json', ShellDialect::Bash, ExecutionContext::inFolder(base_path()), $key);
    }
}
