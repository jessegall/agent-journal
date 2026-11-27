<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Exceptions\HostProtocolRefused;
use App\Exceptions\WorkerFenced;
use App\Hosts\Exceptions\HostProtocolUnsupported;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProtocolVersion;
use App\Hosts\Values\HostInstructionBody;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Time\Contracts\ServerClock;
use App\Values\HostInstructionSource;
use App\Values\HostProcessPlan;

/**
 * Makes an instruction for a running process or for its host, inside the command's transaction: the process is locked, a
 * worker that was replaced is refused, and an instruction made before under the same key is the answer instead of a second.
 */
final readonly class HostInstructionPlacement
{
    /**
     * How long an instruction other than a key write may wait for its host.
     */
    public const int INSTRUCTION_SECONDS = 30;

    /**
     * How long a key write may wait: keys typed late land on a screen that has moved on.
     */
    public const int KEY_SECONDS = 5;

    public function __construct(
        private ServerClock $clock,
        private HostCallReader $reader,
        private ContainedPlanRules $containedRules,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     *
     * @throws WorkerFenced
     * @throws HostProtocolRefused
     */
    public function forProcess(
        string $processId,
        HostInstructionSource $source,
        HostInstructionType $type,
        array $payload,
        int $expirySeconds = self::INSTRUCTION_SECONDS,
    ): HostInstruction {
        $process = HostProcess::findLocked($processId);

        if ($source->workerGeneration !== null) {
            $process->assertWorker($source->workerGeneration);
        }

        if (! $process->isLive()) {
            throw HostProtocolRefused::notRunning($process->id);
        }

        if (! $type->suits($process->type)) {
            throw HostProtocolRefused::unsuited($process->id, $type, $process->type);
        }

        $host = $process->host;
        $this->assertInstructions($host);

        return $this->place($host, $process, HostInstructionBody::from($type, $payload, $source), $expirySeconds);
    }

    /**
     * The instruction that opens a process just made on the host.
     *
     * @throws HostProtocolRefused
     */
    public function forOpening(
        HostProcess $process,
        HostProcessPlan $plan,
        HostInstructionSource $source,
    ): HostInstruction {
        $host = $this->orderingHost($process->host_id);
        $payload = $plan->payload();
        $this->reader->assertValid($payload, 'open plan');
        $this->containedRules->assertKept($payload);
        $body = HostInstructionBody::from($plan->instructionType(), $payload->toArray(), $source);
        $instruction = $this->place($host, $process, $body);
        $process->holdOpenInstruction($instruction->id);

        return $instruction;
    }

    /**
     * An instruction about the host as a whole, which belongs to no process, such as a read of a connected project's folder.
     *
     * @param  array<string, mixed>  $payload
     *
     * @throws HostProtocolRefused
     */
    public function forHost(
        string $hostId,
        HostInstructionSource $source,
        HostInstructionType $type,
        array $payload,
    ): HostInstruction {
        $host = $this->orderingHost($hostId);

        return $this->place($host, null, HostInstructionBody::from($type, $payload, $source));
    }

    /**
     * The host, locked, once it is known to take instructions.
     *
     * @throws HostProtocolRefused
     * @throws HostProtocolUnsupported
     */
    public function orderingHost(string $hostId): Host
    {
        $host = Host::findLocked($hostId);
        $this->assertInstructions($host);

        return $host;
    }

    /**
     * @throws HostProtocolRefused
     */
    private function assertInstructions(Host $host): void
    {
        if ($host->isRevoked()) {
            throw HostProtocolRefused::revoked($host->id);
        }

        if (! $host->acceptsProtocol(HostProtocolVersion::CURRENT)) {
            throw HostProtocolUnsupported::forHost($host->id, $host->protocol);
        }
    }

    private function place(
        Host $host,
        HostProcess|null $process,
        HostInstructionBody $body,
        int $seconds = self::INSTRUCTION_SECONDS,
    ): HostInstruction {
        if (! $host->carriesOut($body->type)) {
            throw HostProtocolRefused::lacksCapability($host->id, $body->type);
        }

        $known = HostInstruction::findWithKey($body->idempotencyKey);

        if ($known !== null) {
            return $known;
        }

        // The process numbers its instructions under its own lock, so the instruction takes the next number before it is made; an
        // instruction about the host waits on no other instruction, so it takes none.
        $sequence = $process === null ? 0 : $process->takeInstructionNumber();

        return HostInstruction::create($host, $process, $body, $this->clock->now()->addSeconds($seconds), $sequence);
    }
}
