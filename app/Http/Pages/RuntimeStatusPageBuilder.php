<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Processes\Data\RecoveryRefusalPartData;
use App\Processes\Data\RuntimeEntryData;
use App\Processes\Data\RuntimeStatus;
use App\Sessions\Contracts\RuntimeResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * The runtime status as summary cards: each runtime's driver, activity, hold, freshness, watchers and a terminal
 * runtime's live link, and under them the owner's recovery controls, settings and latest requests. A refused recovery
 * shows above the runtimes; with none running the page says so.
 */
final readonly class RuntimeStatusPageBuilder implements PageBuilder
{
    private const int RUNTIMES = 50;

    private const int REQUESTS_EACH = 20;

    public function __construct(private RuntimeResolver $runtimes) {}

    public function build(Request $visit): RuntimeStatusPageData
    {
        return RuntimeStatusPageData::build()->shown($this->content())->finish();
    }

    private function content(): DeclaredLayoutData
    {
        $runtimeEntries = array_map(fn (RuntimeStatus $status) => RuntimeEntryData::from([
            'status' => $status,
            'requests' => $this->runtimes->requestsOf($status->sessionId, self::REQUESTS_EACH),
        ]), $this->runtimes->page(1, self::RUNTIMES));

        $parts = [
            LayoutPartData::build()
                ->asBox()
                ->key('header')
                ->style('header')
                ->children(
                    LayoutPartData::build()->asText()->key('title')->value('Runtimes')->style('heading')->finish(),
                )
                ->finish(),
            LayoutPartData::build()
                ->asNative()
                ->key('refusal')
                ->native(
                    LayoutNativeData::build()
                        ->component('web/RuntimeRefusal')
                        ->props(RecoveryRefusalPartData::from(['errorKey' => 'review']))
                        ->finish(),
                )
                ->finish(),
        ];

        if ($runtimeEntries === []) {
            $parts[] = LayoutPartData::build()
                ->asNotice()
                ->key('empty')
                ->style('empty')
                ->title('No active runtimes.')
                ->finish();
        }

        foreach ($runtimeEntries as $entry) {
            $parts[] = $this->cardOf($entry);
        }

        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()->asBox()->key('runtimes')->style('stack')->children(...$parts)->finish(),
            )
            ->finish();
    }

    private function cardOf(RuntimeEntryData $entry): LayoutPartData
    {
        $status = $entry->status;

        $age = $status->observationAgeSeconds === null
            ? 'never observed'
            : "observed {$status->observationAgeSeconds}s ago";

        $summary = [
            LayoutPartData::build()->asText()->key('driver')->value($status->driver)->style('code')->finish(),
            LayoutPartData::build()->asText()->key('activity')->value($status->activity->value)->finish(),
            LayoutPartData::build()
                ->asText()
                ->key('hold')
                ->value("hold: {$status->hold->value}")
                ->style('muted')
                ->finish(),
            $status->isStale ? LayoutPartData::build()
                ->asBadge()
                ->key('observed')
                ->text("{$age}, stale")
                ->tone('warn')
                ->finish() : LayoutPartData::build()
                ->asText()
                ->key('observed')
                ->value($age)
                ->style('muted')
                ->finish(),
        ];

        if ($status->hasScreen) {
            $terminal = LayoutActionData::build()
                ->href(route('web.terminal', ['agent' => $status->agentId], false))
                ->finish();

            $summary[] = LayoutPartData::build()
                ->asAction()
                ->key('terminal')
                ->label('Watch terminal')
                ->action($terminal)
                ->style('ghost')
                ->finish();
        }

        if ($status->watchers > 0) {
            $summary[] = LayoutPartData::build()
                ->asText()
                ->key('watchers')
                ->value("{$status->watchers} watching")
                ->style('muted')
                ->finish();
        }

        return LayoutPartData::build()
            ->asBox()
            ->key($status->runtimeId)
            ->style('card')
            ->children(
                LayoutPartData::build()->asBox()->key('summary')->style('row')->children(...$summary)->finish(),
                LayoutPartData::build()
                    ->asNative()
                    ->key('live')
                    ->native(LayoutNativeData::build()->component('web/RuntimeCard')->props($entry)->finish())
                    ->finish(),
            )
            ->finish();
    }
}
