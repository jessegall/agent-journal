<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\WordLines;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Only the live transport receives page changes: a frontend file that listens for page.changed itself would read the page
 * a second way beside the live props, so the scan names its file and line.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every line of the frontend.')]
final class PageChangeListenerTest extends TestCase
{
    private const string HOW_TO_FIX
        = 'Mark the props live on the server; the live transport hears page.changed and reads them.';

    /**
     * A listen call on page.changed, with or without the leading dot.
     */
    private const string LISTENER = '/listen\(\s*[\'"`]\.?page\.changed[\'"`]/';

    private const string FIXTURE = 'tests/Fixtures/PageChangeListeners';

    /**
     * The live transport and its test, which alone listen for page changes.
     */
    private const string ALLOWED_FILE = '#/resources/js/framework/liveTransport(\.test)?\.ts:#';

    public function test_no_frontend_file_but_the_live_transport_listens_for_page_changes(): void
    {
        $folders = [resource_path('js'), ...(glob(base_path('domain/*/resources/js'), GLOB_ONLYDIR) ?: [])];
        $found = array_values(array_filter(
            WordLines::in(self::LISTENER, $folders),
            fn (string $line): bool => preg_match(self::ALLOWED_FILE, $line) !== 1,
        ));

        $this->assertSame([], $found, self::HOW_TO_FIX);
    }

    public function test_a_page_change_listener_is_found_by_file_and_line_with_or_without_its_dot(): void
    {
        $fixture = base_path(self::FIXTURE.'/ownListener.ts');

        $this->assertSame(["{$fixture}:2", "{$fixture}:3"], WordLines::in(self::LISTENER, [base_path(self::FIXTURE)]));
    }
}
