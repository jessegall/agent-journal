<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Profiles\StartProfilePin;
use App\Recordings\Enums\Wire;
use App\Recordings\RecordedCall;
use App\Recordings\Recordings;
use App\Sessions\AgentClientSettings;
use Closure;
use Illuminate\Contracts\Process\InvokedProcess;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\Response;
use Illuminate\Process\Factory;
use PHPUnit\Framework\Assert;
use Symfony\Component\Process\InputStream;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Seeding\TestJournal;

/**
 * The journal's side of a recorded scenario's agent wire, served on a local address for the agent's own sender to
 * meet: each call gets the recorded journal's answer to the same call, its fakes bound to what the sender sent, and a
 * call the recording does not hold fails the test.
 */
final class TestAgentApi
{
    /**
     * How long the player gets to say the address it listens on.
     */
    private const int START_SECONDS = 10;

    private InvokedProcess|null $player = null;

    private InputStream|null $input = null;

    private string $address = '';

    private string $scenario = '';

    private string $failures = '';

    public function __construct(private readonly TestJournal $journal) {}

    /**
     * The scenario, named as <driver>/<scenario>, is served from here on.
     */
    public function playing(string $scenario): self
    {
        $this->scenario = $scenario;
        $this->failures = (string) tempnam(sys_get_temp_dir(), 'agent-api-failures-');
        $this->input = new InputStream();
        $this->player = $this->journal->service(Factory::class)->newPendingProcess()->forever()->input($this->input)
            ->start([
                TestHost::binary(), 'mock', 'wire', '--scenario', $scenario, '--wire', Wire::Agent->value,
                '--failures', $this->failures, '--until-input-ends',
            ]);
        $deadline = microtime(true) + self::START_SECONDS;

        while (! str_contains($this->player->output(), 'http://') && microtime(true) < $deadline) {
            usleep(50_000);
        }

        $this->address = trim($this->player->output());
        Assert::assertStringStartsWith('http://', $this->address, "The agent wire of {$scenario} was not served.");
        // The played journal is a real one on this machine, the only address the test's sender may reach unfaked.
        $this->journal->service(HttpFactory::class)->allowStrayRequests(["{$this->address}/*"]);

        return $this;
    }

    /**
     * The agent's sender sends the nth frame the recorded agent sent, and meets the answer the recorded journal gave
     * it; the sender gets the address it reaches the played journal on.
     *
     * @param  Closure(AgentClientSettings, string, string): Response  $send  sends the body to the path
     */
    public function assertAnswersFrame(int $nth, Closure $send): self
    {
        return $this->withFrame($nth, function (
            AgentClientSettings $settings,
            RecordedCall $asked,
            RecordedCall $answered,
        ) use ($send): void {
            $response = $send($settings, $asked->path, $asked->body);

            Assert::assertSame([$answered->status, $answered->body], [$response->status(), $response->body()]);
        });
    }

    /**
     * @param  Closure(AgentClientSettings, RecordedCall, RecordedCall): mixed  $scope
     */
    public function withFrame(int $nth, Closure $scope): self
    {
        [$asked, $answered] = $this->recordedFrame($nth);
        $settings = new AgentClientSettings($this->address, 'start-token', new StartProfilePin('journal-worker', 1));
        $scope($settings, $asked, $answered);

        return $this;
    }

    /**
     * The player stops, and it was asked no call the recording does not hold.
     */
    public function stop(): void
    {
        $this->input?->close();
        $this->player?->wait();
        $failures = is_file($this->failures) ? trim((string) file_get_contents($this->failures)) : '';
        @unlink($this->failures);

        Assert::assertSame('', $failures, "The agent wire of {$this->scenario} was asked what it does not hold.");
    }

    /**
     * The nth frame the recorded agent sent, with the recorded journal's answer to it.
     *
     * @return array{RecordedCall, RecordedCall}
     */
    private function recordedFrame(int $nth): array
    {
        [$driver, $name] = explode('/', $this->scenario, 2);
        $calls = $this->journal->service(Recordings::class)->scenario($driver, $name)->calls(Wire::Agent);
        $pairs = [];
        $asked = null;

        foreach ($calls as $call) {
            if ($call->status === null) {
                $asked = $call;

                continue;
            }

            if ($asked !== null) {
                $pairs[] = [$asked, $call];
                $asked = null;
            }
        }

        return $pairs[$nth - 1] ?? Assert::fail("The agent wire of {$this->scenario} holds no frame {$nth}.");
    }
}
