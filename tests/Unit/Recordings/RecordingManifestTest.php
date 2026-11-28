<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Hosts\Protocol\HostProtocolVersion;
use App\Support\Recordings\AgentImageBuild;
use App\Support\Recordings\Enums\StaleReason;
use App\Support\Recordings\RecordingManifest;
use Tests\TestCase;

/**
 * A recording is stale for the first of its reasons that holds: another format, an older host protocol, a changed
 * scenario, or changed agent image programs; the digest of those programs follows the files the image runs only.
 */
final class RecordingManifestTest extends TestCase
{
    public function test_each_reason_makes_a_recording_stale_and_a_fresh_one_has_none(): void
    {
        $manifest = RecordingManifest::of('scenario-1', 'claude-code', '2.1.332', 'programs-1', '2026-11-27', [
            '01-terminal',
        ]);
        $written = $manifest->jsonSerialize();
        $older = RecordingManifest::fromFile([...$written, 'protocol' => HostProtocolVersion::CURRENT - 1]);
        $otherFormat = RecordingManifest::fromFile([...$written, 'format' => RecordingManifest::FORMAT - 1]);

        $this->assertSame(
            [null, StaleReason::Scenario, StaleReason::ImageBuild, StaleReason::Protocol, StaleReason::Format],
            [
                $manifest->staleReasonFor('scenario-1', 'programs-1'),
                $manifest->staleReasonFor('scenario-2', 'programs-1'),
                $manifest->staleReasonFor('scenario-1', 'programs-2'),
                $older->staleReasonFor('scenario-1', 'programs-1'),
                $otherFormat->staleReasonFor('scenario-1', 'programs-1'),
            ],
        );
    }

    public function test_the_programs_digest_follows_the_init_and_not_the_hosts_own_packages(): void
    {
        // The programs' hash is read once per process, so each reading is a process of its own.
        $hash = function (): string {
            $this->app->forgetInstance(AgentImageBuild::class);

            return $this->app->make(AgentImageBuild::class)->hash();
        };
        $before = $hash();

        $init = base_path('programs/runner/bootstrap/agent_image_programs_probe.go');
        $host = base_path('programs/runner/hostapi/agent_image_programs_probe.go');

        try {
            file_put_contents($host, "package hostapi\n");
            $afterHost = $hash();
            file_put_contents($init, "package bootstrap\n");
            $afterInit = $hash();
        } finally {
            @unlink($host);
            @unlink($init);
        }

        $this->assertSame([true, false], [$before === $afterHost, $before === $afterInit]);
    }
}
