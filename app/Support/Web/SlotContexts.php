<?php

declare(strict_types=1);

namespace App\Support\Web;

use App\Contracts\Records\RecordResolver;
use App\Declarations\Slot;
use App\Declarations\SlotContext;
use App\Enums\SlotContextType;
use App\Exceptions\RecordUnavailable;
use App\Http\Requests\Web\DeclaredPageRequest;
use App\Support\RecordReference;
use Illuminate\Routing\Route;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Builds the context a section reads in: nothing, the agent session chosen in the conversation window (the query's session), or the
 * record whose number the host page's route holds. With no session chosen or no record open there is no context, and
 * the section is not read; a record the user may not read is unavailable, the same as a missing one.
 */
final readonly class SlotContexts
{
    public function __construct(private RecordResolver $records) {}

    /**
     * What the visit names for the slot: the chosen session's id or the record number in the host's route, the
     * route the page was bound to, or the inspector's own for a record open there; a visit bound to no route opens
     * no record.
     *
     * @return Option<string>
     */
    public function argumentFor(Slot $slot, DeclaredPageRequest $request, Route|null $route): Option
    {
        return match ($slot->takes) {
            SlotContextType::Nothing => Some::create(''),
            SlotContextType::Session => $this->idIn($request->chosenSession()),
            SlotContextType::Record => $this->textIn($route?->parameter((string) $slot->recordParameter)),
        };
    }

    /**
     * The context the named argument reads in. A record is found by its number only among the records the user may
     * read, through the provider its domain registered.
     *
     * @throws RecordUnavailable
     */
    public function contextFor(Slot $slot, string $argument): SlotContext
    {
        return match ($slot->takes) {
            SlotContextType::Nothing => SlotContext::nothing(),
            SlotContextType::Session => SlotContext::session($argument),
            SlotContextType::Record => SlotContext::record($this->records->identify(
                RecordReference::of((string) $slot->recordType, RouteNumber::of($argument)),
            )->id),
        };
    }

    /**
     * A ULID, as session ids travel in queries.
     *
     * @return Option<string>
     */
    private function idIn(mixed $queryArgument): Option
    {
        if (! is_string($queryArgument) || ! Str::isUlid($queryArgument)) {
            return None::create();
        }

        return Some::create(strtolower($queryArgument));
    }

    /**
     * @return Option<string>
     */
    private function textIn(mixed $routeArgument): Option
    {
        if (! is_string($routeArgument) || $routeArgument === '') {
            return None::create();
        }

        return Some::create($routeArgument);
    }
}
