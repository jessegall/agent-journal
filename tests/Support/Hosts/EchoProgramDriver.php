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
 * pasted with Enter, guarded on the rows it saw, as the one step of that request.
 */
final class EchoProgramDriver implements ProgramDriver
{
    private const string PROMPT = '> ';

    private ClaimedRequest|null $pending = null;

    public function __construct(private readonly HostProcess $process, private readonly int $generation) {}

    public function resume(array $inFlight, array $done): DriverActions
    {
        return DriverActions::none();
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        $rows = $entry->frame?->rows ?? [];

        if ($this->pending === null || ! $this->showsPrompt($rows)) {
            return DriverActions::none();
        }

        $request = $this->pending;
        $this->pending = null;
        $last = count($rows) - 1;
        $guard = new RowGuard(0, $last, hash('sha256', implode("\n", $rows)));
        $source = HostOrderSource::forStep($request->requestId, 'paste', $request->attempt, $this->generation);

        return DriverActions::of(new SendHostKeysCommand($this->process->id, "{$request->message}\r", $guard, 0, $source));
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        if ($request->message !== null) {
            $this->pending = $request;
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
