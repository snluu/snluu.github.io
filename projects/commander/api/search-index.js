crystal_doc_search_index_callback({"repository_name":"github.com/snluu/commander","body":"# commander\n\nCommander is a simple shard that lets you dispatch many concurrent calls at once,\nthen collect the result afterwards.\n\nCommander also allows the caller to choose the maximum concurrency for the given job.\n\n## Installation\n\n1. Add the dependency to your `shard.yml`:\n\n```yaml\ndependencies:\n  commander:\n    github: snluu/commander\n```\n\n2. Run `shards install`\n\n## Usage\n\nSee the spec for more details/examples.\n\n```crystal\nrequire \"commander\"\n\ncmd = Commander(Int32).new\nresult = nil\n\nelapsed = Time.measure do\n  1000.times do |x|\n    cmd.dispatch do\n      sleep 1.seconds\n      x\n    end\n  end\n\n  result = cmd.collect\nend\n\nresult = result.not_nil!\nresult.size.should eq(1000)\n1000.times do |x|\n  result.should contain(x)\nend\n\n# 5 seconds is a very generous buffer.\n# The point is it should not take 1000 seconds\nelapsed.should be < 5.seconds\n\n```\n","program":{"html_id":"github.com/snluu/commander/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"github.com/snluu/commander","program":true,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"github.com/snluu/commander/Commander","path":"Commander.html","kind":"class","full_name":"Commander(T)","name":"Commander","abstract":false,"superclass":{"html_id":"github.com/snluu/commander/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"github.com/snluu/commander/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"github.com/snluu/commander/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"commander.cr","line_number":4,"url":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr"}],"repository_name":"github.com/snluu/commander","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":"A commander can dispatch blocks to run concurrently.\nThe caller can dictate the number of concurrent jobs by\npassing in a max concurrency at the time of initialization.","summary":"<p>A commander can dispatch blocks to run concurrently.</p>","class_methods":[],"constructors":[{"id":"new(max_concurrency=0)-class-method","html_id":"new(max_concurrency=0)-class-method","name":"new","doc":"Initializes a new instance of this class with the given max concurrency.\nMax concurrency will dictate the number of concurrent jobs.\nAll dispatched job will run concurrently if max concurrency is set to zero.","summary":"<p>Initializes a new instance of this class with the given max concurrency.</p>","abstract":false,"args":[{"name":"max_concurrency","doc":null,"default_value":"0","external_name":"max_concurrency","restriction":""}],"args_string":"(max_concurrency = <span class=\"n\">0</span>)","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L14","def":{"name":"new","args":[{"name":"max_concurrency","doc":null,"default_value":"0","external_name":"max_concurrency","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = Commander(T).allocate\n_.initialize(max_concurrency)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"id":"collect-instance-method","html_id":"collect-instance-method","name":"collect","doc":"Collects the result of the dispatched calls.\nThis function will only return once all the dispatched calls are finished.\nThis function will raise the first error that it received from any of the dispatched calls.","summary":"<p>Collects the result of the dispatched calls.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L70","def":{"name":"collect","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"result = [] of T\n@size.times do\n  try = @result_ch.receive\n  if try.has_error?\n    raise(try.error.not_nil!)\n  end\n  result << try.result.not_nil!\nend\n@result_ch.close\nreturn result\n"}},{"id":"collect_tries-instance-method","html_id":"collect_tries-instance-method","name":"collect_tries","doc":"Collects the result of the dispatched calls.\nThis function will only return once all the dispatched calls are finished.\nThis function does not raise any exception from the dispatched calls.\nThe exceptions are wrapped in `Try(T)`, with `has_result` set to false.","summary":"<p>Collects the result of the dispatched calls.</p>","abstract":false,"args":[],"args_string":"","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L56","def":{"name":"collect_tries","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"result = [] of Try(T)\n@size.times do\n  result << @result_ch.receive\nend\n@result_ch.close\nreturn result\n"}},{"id":"dispatch(&block:->T)-instance-method","html_id":"dispatch(&amp;block:-&gt;T)-instance-method","name":"dispatch","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"(&block :  -> T)","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L29","def":{"name":"dispatch","args":[],"double_splat":null,"splat_index":null,"yields":0,"block_arg":{"name":"block","doc":null,"default_value":"","external_name":"block","restriction":"(-> T)"},"return_type":"","visibility":"Public","body":"if @result_ch.closed?\n  raise(\"Cannot dispatch after calling collect\")\nend\n@size = @size + 1\nspawn do\n  cch = @concurrency_ch\n  if cch.nil?\n  else\n    cch.receive\n  end\n  try = Commander::Try(T).new\n  begin\n    try.result = block.call\n  rescue ex\n    try.error = ex\n    try.result = nil\n  end\n  if cch.nil?\n  else\n    cch.send(nil)\n  end\n  @result_ch.send(try)\nend\n"}},{"id":"size:Int32-instance-method","html_id":"size:Int32-instance-method","name":"size","doc":"Gets the number of dispatched jobs","summary":"<p>Gets the number of dispatched jobs</p>","abstract":false,"args":[],"args_string":" : Int32","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L9","def":{"name":"size","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"Int32","visibility":"Public","body":"@size"}}],"macros":[],"types":[{"html_id":"github.com/snluu/commander/Commander/Try","path":"Commander/Try.html","kind":"class","full_name":"Commander::Try(T)","name":"Try","abstract":false,"superclass":{"html_id":"github.com/snluu/commander/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"github.com/snluu/commander/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"github.com/snluu/commander/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"commander.cr","line_number":85,"url":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr"}],"repository_name":"github.com/snluu/commander","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"github.com/snluu/commander/Commander","kind":"class","full_name":"Commander(T)","name":"Commander"},"doc":"Indicates the result of a dispatched call.","summary":"<p>Indicates the result of a dispatched call.</p>","class_methods":[],"constructors":[{"id":"new-class-method","html_id":"new-class-method","name":"new","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L97","def":{"name":"new","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = Try(T).allocate\n_.initialize\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"id":"error:Exception?-instance-method","html_id":"error:Exception?-instance-method","name":"error","doc":null,"summary":null,"abstract":false,"args":[],"args_string":" : Exception?","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L87","def":{"name":"error","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"Exception | ::Nil","visibility":"Public","body":"@error"}},{"id":"error=(error:Exception?)-instance-method","html_id":"error=(error:Exception?)-instance-method","name":"error=","doc":null,"summary":null,"abstract":false,"args":[{"name":"error","doc":null,"default_value":"","external_name":"error","restriction":"Exception | ::Nil"}],"args_string":"(error : Exception?)","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L87","def":{"name":"error=","args":[{"name":"error","doc":null,"default_value":"","external_name":"error","restriction":"Exception | ::Nil"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"@error = error"}},{"id":"has_error?-instance-method","html_id":"has_error?-instance-method","name":"has_error?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L89","def":{"name":"has_error?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"!@error.nil?"}},{"id":"has_result?-instance-method","html_id":"has_result?-instance-method","name":"has_result?","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L93","def":{"name":"has_result?","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"!@result.nil?"}},{"id":"result:T?-instance-method","html_id":"result:T?-instance-method","name":"result","doc":null,"summary":null,"abstract":false,"args":[],"args_string":" : T?","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L86","def":{"name":"result","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"T | ::Nil","visibility":"Public","body":"@result"}},{"id":"result=(result:T?)-instance-method","html_id":"result=(result:T?)-instance-method","name":"result=","doc":null,"summary":null,"abstract":false,"args":[{"name":"result","doc":null,"default_value":"","external_name":"result","restriction":"T | ::Nil"}],"args_string":"(result : T?)","source_link":"https://github.com/snluu/commander/blob/7f9b5ae3966d62360201b4ab9dc45a4becfc2ca7/src/commander.cr#L86","def":{"name":"result=","args":[{"name":"result","doc":null,"default_value":"","external_name":"result","restriction":"T | ::Nil"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"@result = result"}}],"macros":[],"types":[]}]}]}})