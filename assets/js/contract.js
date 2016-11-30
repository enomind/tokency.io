(function(window, $, undefined) {
    'use strict';
    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $(document).ready(function(){
        $("#tag-button").click(function(){
            if(!("#tag-input").val()){
                $("#result-tag").append(("#tag-input").val())    
            }
        });
        $("#find_tag").click(function(){
            var tags = $("#tag_input").val();
            console.log(tags)
            $.ajax({
                url:'/api/contract/getbytag',
                method: "POST",
                data: {tags: tags},
                success: function(data){
                    
                }
            })
        });
        $("#find_category").click(function(){
            var categories = $("#cate_input").val();
            console.log(categories)
            $.ajax({
                url:'/api/contract/getbycategories',
                method: "POST",
                data: {categories: categories},
                success: function(data){
                    
                }
            })
        });
        $("#addContractForm").on('submit',function(e){    
            e.preventDefault();
            var formData =JSON.stringify($('#addContractForm').serializeObject());
           
            $.ajax({
                url: "/api/contract/add",
                data: formData,
                contentType: "application/json",
                dataType: "json",
                type: 'POST',
                success: function(data){
                    alert(data)
                }
            })          
        });

        $("#addContractForm").on('submit',function(e){    
            e.preventDefault();
            var formData =JSON.stringify($('#addContractForm').serializeObject());
           
            $.ajax({
                url: "/api/contract/add",
                data: formData,
                contentType: "application/json",
                dataType: "json",
                type: 'POST',
                success: function(data){
                    alert(data)
                }
            })          
        })
        $("#updateFormContract").on('submit',function(e){    
            e.preventDefault();
            var formData =$('#updateFormContract').serializeObject();
            formData.id =$("#updateFormContract").attr("data-id");      
           
            $.ajax({
                url: "/api/contract/update",
                data: JSON.stringify(formData),
                contentType: "application/json",
                dataType: "json",
                type: 'POST',
                success: function(data){
                    alert(data)
                }
            })          
        })
    });

})(window, window.$);
