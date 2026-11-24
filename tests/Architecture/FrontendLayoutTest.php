<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\FrontendLayout;

/**
 * The browser code of the shell, of every core module and of every domain follows one layout (rule 75): shared
 * components in components/<component>/, a page's components in pages/<page>/ and the components only that page uses
 * in pages/<page>/partials/.
 */
final class FrontendLayoutTest extends TestCase
{
    public function test_a_stray_file_a_partial_of_another_page_and_a_component_of_one_page_are_caught(): void
    {
        $layout = new FrontendLayout(dirname(__DIR__).'/Fixtures/FrontendLayout', [], ['@/' => 'resources/js/']);

        $faults = $layout->faults();
        sort($faults);

        $this->assertSame(
            [
                'resources/js/components/lonely/Lonely.vue is used by resources/js/pages/home/ alone: make it a partial'
                    .' of that page',
                'resources/js/loose/Stray.vue is outside components/<component>/, pages/<page>/ and'
                    .' pages/<page>/partials/',
                'resources/js/pages/home/Home.vue imports the partial resources/js/pages/away/partials/Secret.vue of'
                    .' another page',
            ],
            $faults,
        );
    }

    public function test_every_vue_file_of_the_project_follows_the_layout(): void
    {
        $this->assertSame([], FrontendLayout::ofProject(dirname(__DIR__, 2))->faults());
    }
}
