<?php

declare(strict_types=1);

namespace App\Http\Requests\Concerns;

use App\Support\Layout\ProjectField;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * For a create dialog's request that may carry the Project field: the rule for it and the choice it sent, if any.
 */
trait ReadsChosenProject
{
    /**
     * @return array<string, list<string>>
     */
    protected function projectRules(): array
    {
        return [ProjectField::NAME => ['sometimes', 'string', 'max:64']];
    }

    /**
     * The project id, or Global, the dialog's Project field sent; none when the dialog showed no field.
     *
     * @return Option<string>
     */
    public function chosenProject(): Option
    {
        if (! $this->filled(ProjectField::NAME)) {
            return None::create();
        }

        return new Some($this->string(ProjectField::NAME)->toString());
    }
}
