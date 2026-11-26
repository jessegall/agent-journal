<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Agents\Drivers\Contracts\MessagePart;
use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Enums\HostOrderStatus;
use App\Messages\Data\MessageTextData;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Support\Command;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;
use App\Values\HostOrderSource;
use App\Values\RowGuard;

/**
 * The driver of the stand-in's echo program: a request's message waits until the screen shows the prompt, then is
 * pasted with Enter, guarded on the rows it saw, as the one step of that request. A request a worker before it had
 * taken is pasted only when no paste of it was ordered yet.
 */
final class EchoProcessDriver implements ProcessDriver
{
    private const string PROMPT = '> ';

    private const string PASTE = 'paste';

    /**
     * The message waiting for the prompt, keyed by the paste step it is ordered as.
     *
     * @var array{HostOrderSource, string}|null
     */
    private array|null $pending = null;

    /**
     * The request, attempt and text of the last paste ordered, so a refused one is ordered again.
     *
     * @var array{string, int, string}|null
     */
    private array|null $pasted = null;

    /**
     * How many pastes the host refused, each ordered again as a step of its own.
     */
    private int $refusedPastes = 0;

    public function __construct(private readonly HostProcess $process, private readonly int $generation) {}

    public function resume(array $inFlight, array $ordered): DriverActions
    {
        $pasted = array_map(fn (HostOrder $order) => $order->driver_request_id, array_filter(
            $ordered,
            fn (HostOrder $order) => str_starts_with((string) $order->step, self::PASTE),
        ));

        foreach ($inFlight as $request) {
            $text = self::textOf($request->message, $request->partList());

            if ($text !== '' && ! in_array($request->id, $pasted, true)) {
                $this->pending = [$this->pasteOf($request->id, $request->attempt_version), $text];
            }
        }

        return DriverActions::none();
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        $rows = $entry->frame?->rows ?? [];

        if ($this->pending === null || ! $this->showsPrompt($rows)) {
            return DriverActions::none();
        }

        [$source, $message] = $this->pending;
        $this->pending = null;
        $this->pasted = [(string) $source->driverRequestId, $source->attempt, $message];
        $guard = new RowGuard(0, count($rows) - 1, hash('sha256', implode("\n", $rows)));

        return DriverActions::of(new SendHostKeysCommand($this->process->id, "{$message}\r", $guard, 0, $source));
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        $text = self::textOf($request->message, $request->parts);

        if ($text !== '') {
            $this->pending = [$this->pasteOf($request->requestId, $request->attempt), $text];
        }

        return DriverActions::none();
    }

    public function onAnswer(HostOrder $order): DriverActions
    {
        if ($order->status !== HostOrderStatus::Refused || $this->pasted === null) {
            return DriverActions::none();
        }

        [$requestId, $attempt, $text] = $this->pasted;
        $this->refusedPastes++;
        $step = self::PASTE.'-'.$this->refusedPastes;
        $this->pending = [HostOrderSource::forStep($requestId, $step, $attempt, $this->generation), $text];

        return DriverActions::none();
    }

    public function onAnswered(Command $command, mixed $answer): DriverActions
    {
        return DriverActions::none();
    }

    public function onExit(): DriverActions
    {
        return DriverActions::none();
    }

    /**
     * What a request asks to be typed: its message, or the text of its parts.
     *
     * @param  list<MessagePart>  $parts
     */
    private static function textOf(string|null $message, array $parts): string
    {
        $texts = array_map(
            fn (MessagePart $part) => $part instanceof MessageTextData ? $part->text : '',
            $parts,
        );

        return $message ?? implode('', $texts);
    }

    private function pasteOf(string $requestId, int $attempt): HostOrderSource
    {
        return HostOrderSource::forStep($requestId, self::PASTE, $attempt, $this->generation);
    }

    /**
     * @param  list<string>  $rows
     */
    private function showsPrompt(array $rows): bool
    {
        foreach (array_reverse($rows) as $row) {
            if ($row !== '') {
                return str_starts_with($row, rtrim(self::PROMPT)) && str_ends_with($row, rtrim(self::PROMPT));
            }
        }

        return false;
    }
}
