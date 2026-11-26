<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Commands\Hosts\SendHostKeys\SendHostKeysCommand;
use App\Contracts\Drivers\ProgramDriver;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
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
final class EchoProgramDriver implements ProgramDriver
{
    private const string PROMPT = '> ';

    private const string PASTE = 'paste';

    /**
     * The message waiting for the prompt, keyed by the paste step it is ordered as.
     *
     * @var array{HostOrderSource, string}|null
     */
    private array|null $pending = null;

    public function __construct(private readonly HostProcess $process, private readonly int $generation) {}

    public function resume(array $inFlight, array $ordered): DriverActions
    {
        $pasted = array_map(fn (HostOrder $order) => $order->driver_request_id, array_filter(
            $ordered,
            fn (HostOrder $order) => $order->step === self::PASTE,
        ));

        foreach ($inFlight as $request) {
            if ($request->message !== null && ! in_array($request->id, $pasted, true)) {
                $this->pending = [$this->pasteOf($request->id, $request->attempt_version), $request->message];
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
        $guard = new RowGuard(0, count($rows) - 1, hash('sha256', implode("\n", $rows)));

        return DriverActions::of(new SendHostKeysCommand($this->process->id, "{$message}\r", $guard, 0, $source));
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        if ($request->message !== null) {
            $this->pending = [$this->pasteOf($request->requestId, $request->attempt), $request->message];
        }

        return DriverActions::none();
    }

    public function onAnswer(HostOrder $order): DriverActions
    {
        return DriverActions::none();
    }

    public function onExit(): DriverActions
    {
        return DriverActions::none();
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
