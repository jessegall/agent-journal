<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Api\ApiSender;
use App\Api\Contracts\Domains\ApiSender as ApiSenderContract;
use App\Contracts\Domains\ApiPayload;
use App\Exceptions\ApiRefused;
use App\Exceptions\JournalUnreachable;
use Illuminate\Container\Container;
use PHPUnit\Framework\Assert;
use RuntimeException;
use Spatie\LaravelData\Data;

/**
 * A call sender for tests: it answers or refuses each call class as told and records every call it sends; in pass-
 * through mode it sends to the real server until the test cuts it.
 */
final class RecordedPayloads implements ApiSenderContract
{
    private const string UNEXPECTED_CALL = 'A call was sent.';

    /**
     * @var array<class-string, Data>
     */
    private array $answers = [];

    /**
     * @var array<class-string, ApiRefused>
     */
    private array $refusals = [];

    /**
     * @var list<ApiPayload>
     */
    private array $sent = [];

    private bool $passesThrough = false;

    public static function bind(): self
    {
        $calls = new self();
        Container::getInstance()->instance(ApiSenderContract::class, $calls);

        return $calls;
    }

    /**
     * @param  class-string  $call
     */
    public function answer(string $call, Data $answer): self
    {
        $this->answers[$call] = $answer;

        return $this;
    }

    /**
     * @param  class-string  $call
     */
    public function refuse(string $call, ApiRefused $refusal): self
    {
        $this->refusals[$call] = $refusal;

        return $this;
    }

    public function passThrough(): self
    {
        $this->passesThrough = true;

        return $this;
    }

    /**
     * Stops sending to the real server: every later call is answered as told, or refused as unreachable.
     */
    public function cut(): self
    {
        $this->passesThrough = false;

        return $this;
    }

    public function send(ApiPayload $call): Data
    {
        $this->sent[] = $call;

        if (array_key_exists($call::class, $this->refusals)) {
            throw $this->refusals[$call::class];
        }

        if ($this->passesThrough) {
            return Container::getInstance()->make(ApiSender::class)->send($call);
        }

        $cut = new RuntimeException('The connection was cut.');

        return $this->answers[$call::class] ?? throw JournalUnreachable::at('http://journal.test', $cut);
    }

    /**
     * @param  class-string  $call
     */
    public function assertSent(string $call): void
    {
        $classes = array_map(fn (ApiPayload $sent) => $sent::class, $this->sent);

        Assert::assertContains($call, $classes, $call);
    }

    public function assertNothingSent(): void
    {
        Assert::assertSame([], $this->sent, self::UNEXPECTED_CALL);
    }
}
