<?php

declare(strict_types=1);

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Inertia\ResponseFactory;

/**
 * How a page action answers: a redirect back to the page it came from, with its flash, so the page reloads only the
 * props it asked for and keeps its open state. A refusal needs nothing here: Inertia maps it to the page's errors.
 */
final readonly class PageActionAnswers
{
    /**
     * The flash key of the notice the shell's toast region shows.
     */
    public const string NOTICE = 'notice';

    public function __construct(private ResponseFactory $inertia) {}

    /**
     * Back to the page, with a notice the toast region shows once.
     */
    public function backWithNotice(string $notice): RedirectResponse
    {
        return $this->inertia->flash(self::NOTICE, $notice)->back(303);
    }

    /**
     * Back to the page, with a value the form reads from its own answer, such as the id of what it made.
     */
    public function backWith(string $key, mixed $value): RedirectResponse
    {
        return $this->inertia->flash($key, $value)->back(303);
    }
}
