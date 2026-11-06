class ReaderTickSample:
    def advance(self, process, output, is_final):
        # @sin architecture_processes_whole_output_read_in_a_tick
        text = self.folder.reader_text(process.id, output.reader_position)
        # @sin architecture_processes_whole_output_read_in_a_tick
        raw = self.folder.all_output(process.id)
        return text, raw

    def read_completed(self, process, output, is_final):
        if not is_final:
            return None
        # @righteous architecture_processes_whole_output_read_in_a_tick
        return self.folder.reader_text(process.id, output.reader_position)

    def final_branch(self, process, is_final):
        if is_final:
            # @righteous architecture_processes_whole_output_read_in_a_tick
            return self.folder.all_output(process.id)
        return None

    def read_initial(self, process):
        # @righteous architecture_processes_whole_output_read_in_a_tick
        return self.folder.reader_text(process.id, 1)
