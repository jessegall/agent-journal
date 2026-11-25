<?php

declare(strict_types=1);

namespace Tests\Commands\Layouts;

use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Data\Layouts\LayoutShape;
use App\Models\Access\User;
use App\Models\Records\Layout;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user saves the screen's layout under a name, kept as theirs with its shape.
 */
#[TestsCommand(SaveLayoutCommand::class)]
final class SaveLayoutTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * @var array<string, mixed>
     */
    private array $shape = [
        'grid' => [
            'type' => 'pane',
            'id' => 'pane-chat',
            'windows' => ['chat'],
            'active' => 'chat',
            'isWidthLimited' => false,
        ],
        'detached' => [],
    ];

    public function test_a_saved_layout_is_kept_as_the_users_with_its_shape(): void
    {
        $this->journal->owner();

        $this->journal->run(new SaveLayoutCommand('Writing', LayoutShape::from(self::shape('chat'))));

        $layout = Layout::query()->sole();
        $this->assertSame(['Writing', $this->journal->ownerUser()->id], [$layout->name, $layout->user_id]);
        $this->assertSame(['chat'], $layout->shape->grid->windows);
    }

    public function test_a_name_is_used_once_per_user_and_may_not_be_blank(): void
    {
        $this->journal->owner();

        $this->actingAs($this->journal->ownerUser())->post('/layouts', ['name' => 'Review', 'shape' => $this->shape]);

        $this->actingAs($this->journal->ownerUser())->post(
            '/layouts',
            ['name' => 'Review', 'shape' => $this->shape],
        )->assertSessionHasErrors('name');
        $this->actingAs($this->journal->ownerUser())->post(
            '/layouts',
            ['name' => '  ', 'shape' => $this->shape],
        )->assertSessionHasErrors('name');
        $this->actingAs($this->journal->ownerUser())->post(
            '/layouts',
            ['name' => 'Other', 'shape' => ['grid' => []]],
        )->assertSessionHasErrors(['shape.grid', 'shape.detached']);
        $this->assertSame(1, Layout::query()->count());
    }

    /**
     * @return array<string, mixed>
     */
    public static function shape(string $window): array
    {
        return [
            'grid' => [
                'type' => 'pane',
                'id' => 'pane-1',
                'windows' => [$window],
                'active' => $window,
                'isWidthLimited' => false,
            ],
            'detached' => [],
        ];
    }
}
