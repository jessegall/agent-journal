<?php

declare(strict_types=1);

namespace App\Http\Support\Web;

use App\Http\Requests\Web\DeclaredPageRequest;
use App\Ui\Declarations\Slot;
use App\Ui\Declarations\SlotContext;
use App\Ui\Enums\SlotContextType;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Builds the context a section reads in: nothing, the agent session chosen in Chat (the query's session), or the
 * record the host page's route parameter names. With no session chosen or no record open there is no context, and
 * the section is not read.
 */
final readonly class SlotContexts
{
    /**
     * @return Option<SlotContext>
     */
    public function for(Slot $slot, DeclaredPageRequest $request): Option
    {
        return match ($slot->takes) {
            SlotContextType::Nothing => Some::create(SlotContext::nothing()),
            SlotContextType::Session => $this->idIn($request->chosenSession())->map(SlotContext::session(...)),
            SlotContextType::Record => $this->idIn(
                $request->route((string) $slot->recordParameter),
            )->map(SlotContext::record(...)),
        };
    }

    /**
     * A ULID, as ids travel in queries and routes.
     *
     * @return Option<string>
     */
    private function idIn(mixed $value): Option
    {
        if (! is_string($value) || ! Str::isUlid($value)) {
            return None::create();
        }

        return Some::create(strtolower($value));
    }
}
