<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\Processes\Contracts\StopSignal;
use App\Processes\Enums\OutputStream;

/**
 * Moves bytes between the concurrent stages of a pipeline (doc 21 revision 6, section 53): each stage's output is
 * handed to the callback, which records it, before it is forwarded to the next stage; at most 1 MiB waits per stage,
 * then the producer is no longer read. When a consumer ends, its producer's pipe is closed, so the producer gets
 * SIGPIPE on its next write as it would in a shell.
 */
final class PipelinePump
{
    private const int WAITING_BYTES = 1_048_576;

    /**
     * @param  list<SpawnedProcess>  $stages
     * @param  callable(int, OutputStream, string): void  $onOutput  stage index, stream, bytes
     */
    public function run(array $stages, callable $onOutput, StopSignal $stop): void
    {
        pcntl_signal(SIGPIPE, SIG_IGN);
        $last = count($stages) - 1;
        $readers = [];
        $inputs = [];
        foreach ($stages as $index => $stage) {
            foreach ($stage->openPipes() as $descriptor => $pipe) {
                stream_set_blocking($pipe, false);
                if ($descriptor === 0) {
                    $inputs[$index] = $pipe;

                    continue;
                }
                $readers["{$index}:{$descriptor}"] = $pipe;
            }
        }
        $waiting = array_fill(0, count($stages), '');
        while ($readers !== [] && ! $stop->isRequested()) {
            $read = array_values(array_filter($readers, fn ($pipe, string $key) => ! str_ends_with($key, ':1') || strlen($waiting[(int) $key]) < self::WAITING_BYTES, ARRAY_FILTER_USE_BOTH));
            $write = array_values(array_filter($inputs, fn ($pipe, int $index) => $waiting[$index - 1] !== '', ARRAY_FILTER_USE_BOTH));
            $except = null;
            if (($read !== [] || $write !== []) && @stream_select($read, $write, $except, 0, 200_000) === false) {
                break;
            }
            foreach ($readers as $key => $pipe) {
                [$index, $descriptor] = array_map(intval(...), explode(':', $key));
                $bytes = fread($pipe, 65_536);
                if ($bytes !== false && $bytes !== '') {
                    $onOutput($index, $descriptor === 1 ? OutputStream::Stdout : OutputStream::Stderr, $bytes);
                    $waiting[$index] .= $descriptor === 1 && $index < $last && isset($inputs[$index + 1]) ? $bytes : '';
                }
                if (feof($pipe)) {
                    fclose($pipe);
                    unset($readers[$key]);
                }
            }
            foreach ($inputs as $index => $input) {
                $consumerEnded = $stages[$index]->hasEnded();
                if ($waiting[$index - 1] !== '' && ! $consumerEnded) {
                    $written = @fwrite($input, $waiting[$index - 1]);
                    $waiting[$index - 1] = $written === false ? '' : substr($waiting[$index - 1], $written);
                }
                $producerDone = ! isset($readers[($index - 1).':1']);
                if ($consumerEnded || ($producerDone && $waiting[$index - 1] === '')) {
                    fclose($input);
                    unset($inputs[$index]);
                    $waiting[$index - 1] = '';
                    if ($consumerEnded && isset($readers[($index - 1).':1'])) {
                        fclose($readers[($index - 1).':1']);
                        unset($readers[($index - 1).':1']);
                    }
                }
            }
        }
    }
}
