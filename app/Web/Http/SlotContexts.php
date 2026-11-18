<?php

declare(strict_types=1);

namespace App\Web\Http;

use App\Ui\Declarations\Slot;
use App\Ui\Declarations\SlotContext;
use App\Ui\Enums\SlotContextType;
use App\Web\Http\Requests\DeclaredPageRequest;
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
            SlotContextType::Record => $this->idIn($request->route((string) $slot->recordParameter))->map(SlotContext::record(...)),
        };
    }

    /**
     * A positive whole number written in decimals, as ids travel in queries and routes.
     *
     * @return Option<int>
     */
    private function idIn(mixed $value): Option
    {
        if (! is_string($value) || preg_match('/^[1-9][0-9]{0,18}$/', $value) !== 1) {
            return None::create();
        }

        return Some::create((int) $value);
    }
}
